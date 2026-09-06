"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const STORAGE_ACTIVE_KEY = "nfc_admin_session_active";
const STORAGE_TAB_ID_KEY = "nfc_admin_tab_id";
const STORAGE_RELOAD_KEY = "nfc_admin_is_reloading";

export function AdminSessionManager() {
  const pathname = usePathname();

  useEffect(() => {
    // Only manage session for authenticated admin routes, not the login page itself
    if (pathname === "/admin/login") {
      return;
    }

    // 1. Initialize per-tab session state
    let tabId = sessionStorage.getItem(STORAGE_TAB_ID_KEY);
    if (!tabId) {
      tabId = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `tab_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      sessionStorage.setItem(STORAGE_TAB_ID_KEY, tabId);
    }

    sessionStorage.setItem(STORAGE_ACTIVE_KEY, "true");

    // 2. Immediately cancel any pending tab exit (e.g., if this was a reload)
    try {
      fetch("/api/admin/cancel-exit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tabId }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // ignore network errors
    }

    // 3. Detect keyboard refresh (F5 / Ctrl+R / Cmd+R)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F5" || ((e.ctrlKey || e.metaKey) && (e.key === "r" || e.key === "R"))) {
        sessionStorage.setItem(STORAGE_RELOAD_KEY, "true");
      }
    };

    // 4. Intercept link clicks leaving Admin area to a public route (Admin -> Public)
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

        // Check if internal navigation
        if (dest.origin === window.location.origin) {
          const isDestinationAdmin = dest.pathname.startsWith("/admin");

          if (!isDestinationAdmin) {
            // Admin -> Public navigation!
            sessionStorage.removeItem(STORAGE_ACTIVE_KEY);

            // Trigger server signout via beacon
            if (typeof navigator !== "undefined" && navigator.sendBeacon) {
              const payload = JSON.stringify({ tabId });
              const blob = new Blob([payload], { type: "application/json" });
              navigator.sendBeacon("/api/admin/logout", blob);
            }

            // Trigger client signout
            const supabase = createClient();
            supabase.auth.signOut().catch(() => {});
          }
        }
      } catch {
        // ignore URL parsing error
      }
    };

    // 5. Best-effort logout when the Admin closes/leaves the browser tab
    const handlePageHide = (e: PageTransitionEvent) => {
      // If persisted in bfcache or reloading via keyboard, preserve session
      const isReloading = sessionStorage.getItem(STORAGE_RELOAD_KEY) === "true";
      sessionStorage.removeItem(STORAGE_RELOAD_KEY);

      if (isReloading || e.persisted) {
        return;
      }

      // Best-effort logout using sendBeacon with grace period
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const payload = JSON.stringify({ tabId });
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/admin/tab-exit", blob);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("pagehide", handlePageHide);
      // NOTE: We do NOT execute signOut() on unmount because component unmounts
      // during normal in-admin navigation and re-renders.
    };
  }, [pathname]);

  return null;
}
