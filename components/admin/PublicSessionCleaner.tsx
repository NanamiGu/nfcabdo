"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const STORAGE_ACTIVE_KEY = "nfc_admin_session_active";
const STORAGE_TAB_ID_KEY = "nfc_admin_tab_id";

/**
 * PublicSessionCleaner runs at the root level to detect when a tab
 * that was previously authenticated in the Admin area navigates to
 * any public route (e.g. /artex, /amine, /).
 *
 * In accordance with project rules:
 * - Admin -> Admin: KEEP SESSION
 * - Admin -> Public: SIGN OUT
 * - Public visitor: No impact
 */
const LOCAL_TABS_KEY = "nfc_admin_open_tabs";

export function PublicSessionCleaner() {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    const prevPathname = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    // Only inspect non-admin routes
    const isPublicRoute = !pathname.startsWith("/admin");

    if (isPublicRoute && typeof window !== "undefined") {
      // Only sign out if THIS tab actually transitioned from an authenticated admin page
      // to a public page within the same tab session.
      // We do NOT use cloned sessionStorage alone to prevent killing the admin session
      // when preview links are opened in new tabs (target="_blank").
      const wasInAdmin =
        prevPathname.startsWith("/admin") && prevPathname !== "/admin/login";

      if (wasInAdmin) {
        // Admin actively navigated from the Admin area to a public route in this tab!
        sessionStorage.removeItem(STORAGE_ACTIVE_KEY);

        const tabId = sessionStorage.getItem(STORAGE_TAB_ID_KEY);
        if (tabId) {
          try {
            const raw = localStorage.getItem(LOCAL_TABS_KEY);
            if (raw) {
              const registry = JSON.parse(raw);
              delete registry[tabId];
              localStorage.setItem(LOCAL_TABS_KEY, JSON.stringify(registry));
            }
          } catch {
            // ignore
          }
        }

        if (typeof navigator !== "undefined" && navigator.sendBeacon) {
          const payload = JSON.stringify({ tabId });
          const blob = new Blob([payload], { type: "application/json" });
          navigator.sendBeacon("/api/admin/logout", blob);
        }

        const supabase = createClient();
        supabase.auth.signOut().catch(() => {});
      }
    }
  }, [pathname]);

  return null;
}
