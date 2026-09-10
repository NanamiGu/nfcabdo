"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const STORAGE_ACTIVE_KEY = "nfc_admin_session_active";
const STORAGE_TAB_ID_KEY = "nfc_admin_tab_id";
const STORAGE_RELOAD_KEY = "nfc_admin_is_reloading";
const LOCAL_TABS_KEY = "nfc_admin_open_tabs";
const TAB_HEARTBEAT_INTERVAL = 3000;
const TAB_STALE_THRESHOLD = 10000;

interface TabRegistry {
  [tabId: string]: number;
}

/**
 * Returns any OTHER active admin tabs registered in localStorage.
 * Tabs with heartbeats older than TAB_STALE_THRESHOLD are treated as stale/closed.
 */
function getOtherActiveTabs(currentTabId: string): TabRegistry {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LOCAL_TABS_KEY);
    if (!raw) return {};
    const parsed: TabRegistry = JSON.parse(raw);
    const now = Date.now();
    const active: TabRegistry = {};
    for (const [id, ts] of Object.entries(parsed)) {
      if (id !== currentTabId && now - ts < TAB_STALE_THRESHOLD) {
        active[id] = ts;
      }
    }
    return active;
  } catch {
    return {};
  }
}

/**
 * Registers or updates a heartbeat for this tab in localStorage.
 */
function registerTab(tabId: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LOCAL_TABS_KEY);
    const registry: TabRegistry = raw ? JSON.parse(raw) : {};
    const now = Date.now();
    const updated: TabRegistry = {};

    // Prune stale entries while updating
    for (const [id, ts] of Object.entries(registry)) {
      if (now - ts < TAB_STALE_THRESHOLD) {
        updated[id] = ts;
      }
    }
    updated[tabId] = now;
    localStorage.setItem(LOCAL_TABS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors (e.g. private browsing quota)
  }
}

/**
 * Removes this tab from the shared registry in localStorage.
 */
function unregisterTab(tabId: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LOCAL_TABS_KEY);
    if (!raw) return;
    const registry: TabRegistry = JSON.parse(raw);
    delete registry[tabId];
    localStorage.setItem(LOCAL_TABS_KEY, JSON.stringify(registry));
  } catch {
    // Ignore errors
  }
}

export function AdminSessionManager() {
  const pathname = usePathname();
  const isInternalNavRef = useRef(false);

  useEffect(() => {
    // Do not manage session on the login page itself
    if (pathname === "/admin/login") {
      return;
    }

    // Reset internal navigation flag on route arrival
    isInternalNavRef.current = false;

    // 1. Initialize per-tab session identity
    let tabId = sessionStorage.getItem(STORAGE_TAB_ID_KEY);
    if (!tabId) {
      tabId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `tab_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      sessionStorage.setItem(STORAGE_TAB_ID_KEY, tabId);
    }

    sessionStorage.setItem(STORAGE_ACTIVE_KEY, "true");
    registerTab(tabId);

    // 2. Tab Heartbeat to maintain active presence in localStorage
    const heartbeatTimer = setInterval(() => {
      if (tabId) {
        registerTab(tabId);
      }
    }, TAB_HEARTBEAT_INTERVAL);

    // 3. Detect keyboard refresh (F5 / Ctrl+R / Cmd+R)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F5" ||
        ((e.ctrlKey || e.metaKey) && (e.key === "r" || e.key === "R"))
      ) {
        sessionStorage.setItem(STORAGE_RELOAD_KEY, "true");
      }
    };

    // 4. Intercept link clicks leaving Admin area or navigating within Admin
    const handleDocumentClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor || !anchor.href) return;

      // New tabs / windows do not navigate the current tab away
      if (
        anchor.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.button !== 0
      ) {
        return;
      }

      try {
        const dest = new URL(anchor.href, window.location.origin);

        if (dest.origin === window.location.origin) {
          const isDestinationAdmin = dest.pathname.startsWith("/admin");

          if (isDestinationAdmin) {
            // Admin -> Admin navigation (CASE B: KEEP SESSION)
            isInternalNavRef.current = true;
          } else {
            // Admin -> Public navigation (CASE D: SIGN OUT)
            sessionStorage.removeItem(STORAGE_ACTIVE_KEY);
            unregisterTab(tabId!);

            if (typeof navigator !== "undefined" && navigator.sendBeacon) {
              const payload = JSON.stringify({ tabId });
              const blob = new Blob([payload], { type: "application/json" });
              navigator.sendBeacon("/api/admin/logout", blob);
            }

            const supabase = createClient();
            supabase.auth.signOut().catch(() => {});
          }
        }
      } catch {
        // ignore URL parsing error
      }
    };

    // 5. Best-effort logout when the Admin closes/leaves the browser tab (CASE E)
    // =========================================================================
    // LIMITATION NOTE:
    // Standard web browser lifecycle APIs (pagehide / beforeunload) do not provide
    // a guaranteed mechanism to differentiate between a user closing a tab versus
    // reloading via browser chrome UI (e.g. clicking the reload button).
    // Keyboard reloads (F5 / Ctrl+R / Cmd+R) and internal admin navigation are
    // detected and explicitly exempted to preserve the session (CASE B & C).
    // Furthermore, multi-tab coordination ensures that if another Admin tab is active,
    // closing Tab A will NOT terminate Tab B's active session.
    // If this is the last Admin tab closing, best-effort logout is performed via
    // navigator.sendBeacon and client-side supabase.auth.signOut().
    // =========================================================================
    const handlePageHide = (e: PageTransitionEvent) => {
      // If persisted in bfcache (e.g. mobile back/forward), keep session intact
      if (e.persisted) {
        return;
      }

      const isReloading = sessionStorage.getItem(STORAGE_RELOAD_KEY) === "true";
      sessionStorage.removeItem(STORAGE_RELOAD_KEY);

      // Preserve session on confirmed refresh or internal navigation
      if (isReloading || isInternalNavRef.current) {
        registerTab(tabId!);
        return;
      }

      // Tab is closing or user is navigating away from site
      unregisterTab(tabId!);

      // Multi-tab check: do not terminate session if other admin tabs remain active
      const otherActiveTabs = getOtherActiveTabs(tabId!);
      if (Object.keys(otherActiveTabs).length > 0) {
        return;
      }

      // Last admin tab: best-effort signout
      sessionStorage.removeItem(STORAGE_ACTIVE_KEY);

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const payload = JSON.stringify({ tabId });
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/admin/logout", blob);
      }

      const supabase = createClient();
      supabase.auth.signOut().catch(() => {});
    };

    window.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      clearInterval(heartbeatTimer);
      window.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("pagehide", handlePageHide);
      // NOTE: We do NOT execute signOut() on unmount because component unmounts
      // during normal in-admin navigation and re-renders.
    };
  }, [pathname]);

  return null;
}
