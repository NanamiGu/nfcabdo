import type { SupabaseClient } from "@supabase/supabase-js";

interface PendingExit {
  timeout: NodeJS.Timeout;
  supabase: SupabaseClient;
}

const globalForAdminSession = globalThis as unknown as {
  pendingTabExits?: Map<string, PendingExit>;
};

const pendingTabExits =
  globalForAdminSession.pendingTabExits || new Map<string, PendingExit>();

if (process.env.NODE_ENV !== "production") {
  globalForAdminSession.pendingTabExits = pendingTabExits;
}

/**
 * Schedules a delayed session termination when an admin tab unloads.
 * If the user refreshed the page, the newly loaded admin page
 * will cancel this pending exit before delayMs expires.
 * If the user actually closed the tab or left the site, delayMs expires
 * and the Supabase session is revoked.
 */
export function scheduleTabExit(
  tabId: string,
  supabase: SupabaseClient,
  delayMs = 3000
) {
  cancelTabExit(tabId);

  const timeout = setTimeout(async () => {
    pendingTabExits.delete(tabId);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("[admin-session] Error during delayed tab exit signout:", err);
    }
  }, delayMs);

  pendingTabExits.set(tabId, { timeout, supabase });
}

/**
 * Cancels a pending tab exit.
 * If tabId is provided, cancels that specific tab.
 * Also cancels all pending exits if called without tabId or if tabId is matched,
 * ensuring no accidental logouts for the single admin user.
 */
export function cancelTabExit(tabId?: string): boolean {
  if (tabId && pendingTabExits.has(tabId)) {
    const pending = pendingTabExits.get(tabId)!;
    clearTimeout(pending.timeout);
    pendingTabExits.delete(tabId);
    return true;
  }

  if (!tabId && pendingTabExits.size > 0) {
    for (const [id, pending] of pendingTabExits.entries()) {
      clearTimeout(pending.timeout);
      pendingTabExits.delete(id);
    }
    return true;
  }

  return false;
}
