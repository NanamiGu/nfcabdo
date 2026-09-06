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
export function PublicSessionCleaner() {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    const prevPathname = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    // Only inspect non-admin routes
    const isPublicRoute = !pathname.startsWith("/admin");

    if (isPublicRoute && typeof window !== "undefined") {
      const hadAdminSession = sessionStorage.getItem(STORAGE_ACTIVE_KEY) === "true";
      const wasInAdmin = prevPathname.startsWith("/admin") && prevPathname !== "/admin/login";

      if (hadAdminSession || wasInAdmin) {
        // Admin has left the Admin area and navigated to a public route!
        sessionStorage.removeItem(STORAGE_ACTIVE_KEY);

        const tabId = sessionStorage.getItem(STORAGE_TAB_ID_KEY);
        if (tabId && typeof navigator !== "undefined" && navigator.sendBeacon) {
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
