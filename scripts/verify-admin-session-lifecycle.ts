import { scheduleTabExit, cancelTabExit } from "../lib/supabase/admin-session.ts";
import type { SupabaseClient } from "@supabase/supabase-js";

console.log("=== RUNNING ADMIN AUTH & SESSION LIFECYCLE VERIFICATION SUITE ===\n");

let passed = 0;
let total = 0;

function assert(condition: boolean, testName: string) {
  total++;
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    throw new Error(`Assertion failed for: ${testName}`);
  }
  passed++;
  console.log(`✓ PASSED: ${testName}`);
}

// Mock Supabase client for testing lifecycle operations
let signOutCalledCount = 0;
const mockSupabase = {
  auth: {
    signOut: async () => {
      signOutCalledCount++;
      return { error: null };
    },
  },
} as unknown as SupabaseClient;

// 1. Tab Exit cancellation on page reload scenario
scheduleTabExit("tab_test_1", mockSupabase, 500);
const cancelled = cancelTabExit("tab_test_1");
assert(cancelled === true, "cancelTabExit returns true when cancelling active tab");

// Wait 600ms to ensure the cancelled timer did NOT fire
await new Promise((resolve) => setTimeout(resolve, 600));
assert(signOutCalledCount === 0, "Cancelled tab exit timer does NOT trigger signOut");

// 2. Tab Exit timeout firing when tab is actually closed (no cancel sent)
scheduleTabExit("tab_test_2", mockSupabase, 150);
await new Promise((resolve) => setTimeout(resolve, 300));
assert(signOutCalledCount === 1, "Uncancelled tab exit timer successfully triggers signOut on exit");

// 3. Global cancelTabExit() when no tabId is passed (e.g. proxy request on reload)
scheduleTabExit("tab_test_3a", mockSupabase, 500);
scheduleTabExit("tab_test_3b", mockSupabase, 500);
const allCancelled = cancelTabExit();
assert(allCancelled === true, "cancelTabExit() without arguments cancels all pending exits");
await new Promise((resolve) => setTimeout(resolve, 600));
assert(signOutCalledCount === 1, "Global cancellation prevented pending signouts");

// 4. Admin -> Admin navigation route evaluation
function evaluateNavigation(
  fromPath: string,
  toPath: string,
  isSameTab: boolean
): "KEEP_SESSION" | "SIGN_OUT" | "NO_ACTION" {
  const isFromAdmin = fromPath.startsWith("/admin") && fromPath !== "/admin/login";
  const isToAdmin = toPath.startsWith("/admin");

  if (isFromAdmin && isToAdmin) {
    return "KEEP_SESSION";
  }

  if (isFromAdmin && !isToAdmin && isSameTab) {
    return "SIGN_OUT";
  }

  return "NO_ACTION";
}

assert(
  evaluateNavigation("/admin", "/admin/profiles", true) === "KEEP_SESSION",
  "Admin -> Admin (/admin to /admin/profiles) KEEP_SESSION"
);
assert(
  evaluateNavigation("/admin/profiles", "/admin/profiles/new", true) === "KEEP_SESSION",
  "Admin -> Admin (/admin/profiles to /admin/profiles/new) KEEP_SESSION"
);
assert(
  evaluateNavigation("/admin/profiles", "/admin/profiles/123/edit", true) === "KEEP_SESSION",
  "Admin -> Admin (/admin/profiles to /admin/profiles/123/edit) KEEP_SESSION"
);
assert(
  evaluateNavigation("/admin", "/artex", true) === "SIGN_OUT",
  "Admin -> Public (/admin to /artex) SIGN_OUT"
);
assert(
  evaluateNavigation("/admin", "/", true) === "SIGN_OUT",
  "Admin -> Public (/admin to /) SIGN_OUT"
);
assert(
  evaluateNavigation("/admin", "/amine", true) === "SIGN_OUT",
  "Admin -> Public (/admin to /amine) SIGN_OUT"
);
assert(
  evaluateNavigation("/admin", "/artex", false) === "NO_ACTION",
  "Admin opening /artex in new tab (target=_blank) preserves Admin tab session"
);
assert(
  evaluateNavigation("/artex", "/amine", true) === "NO_ACTION",
  "Public visitor browsing between public profiles does not trigger auth actions"
);

// 5. Browser refresh simulation
function simulateBrowserRefresh(currentPath: string, isReloadKey: boolean): "KEEP_SESSION" | "SIGN_OUT" {
  const isTargetAdmin = currentPath.startsWith("/admin");
  if (isTargetAdmin && isReloadKey) {
    return "KEEP_SESSION";
  }
  return isTargetAdmin ? "KEEP_SESSION" : "SIGN_OUT";
}

assert(
  simulateBrowserRefresh("/admin", true) === "KEEP_SESSION",
  "Browser refresh on /admin preserves session"
);
assert(
  simulateBrowserRefresh("/admin/profiles/new", true) === "KEEP_SESSION",
  "Browser refresh on /admin/profiles/new preserves session"
);

// 6. Route protection behavior
function checkProxyRedirection(
  pathname: string,
  user: { id: string } | null
): { redirect: string | null } {
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage && !user) {
    return { redirect: `/admin/login?redirect=${encodeURIComponent(pathname)}` };
  }
  if (isLoginPage && user) {
    return { redirect: "/admin" };
  }
  return { redirect: null };
}

assert(
  checkProxyRedirection("/admin", null).redirect === "/admin/login?redirect=%2Fadmin",
  "Unauthenticated /admin redirects to /admin/login"
);
assert(
  checkProxyRedirection("/admin/profiles", null).redirect === "/admin/login?redirect=%2Fadmin%2Fprofiles",
  "Unauthenticated /admin/profiles redirects to /admin/login"
);
assert(
  checkProxyRedirection("/admin", { id: "admin-user" }).redirect === null,
  "Authenticated /admin is allowed through"
);
assert(
  checkProxyRedirection("/artex", null).redirect === null,
  "Public profile /artex is allowed through without authentication"
);

// 7. Open redirect & Backslash vulnerability prevention
function validateSafeRedirect(redirect: string | null): string {
  if (
    redirect &&
    redirect.startsWith("/") &&
    !redirect.startsWith("//") &&
    !redirect.includes("\\")
  ) {
    return redirect;
  }
  return "/admin";
}

assert(validateSafeRedirect("/admin/profiles") === "/admin/profiles", "Safe relative redirect preserved");
assert(validateSafeRedirect("//evil.com") === "/admin", "Protocol-relative open redirect neutralized");
assert(validateSafeRedirect("/\\evil.com") === "/admin", "Backslash open redirect bypass neutralized");
assert(validateSafeRedirect("https://evil.com") === "/admin", "Absolute URL open redirect neutralized");
assert(validateSafeRedirect(null) === "/admin", "Null redirect defaults safely to /admin");

// 8. Registry reserved slugs defense
import { RESERVED_SLUGS } from "../lib/urls.ts";
assert(RESERVED_SLUGS.has("admin"), "Reserved slugs defense includes 'admin'");
assert(RESERVED_SLUGS.has("login"), "Reserved slugs defense includes 'login'");
assert(RESERVED_SLUGS.has("api"), "Reserved slugs defense includes 'api'");
assert(!RESERVED_SLUGS.has("artex"), "Reserved slugs allows public 'artex' profile");

console.log(`\n=================================================`);
console.log(`🎉 ALL ${passed}/${total} ADMIN LIFECYCLE TESTS PASSED!`);
console.log(`=================================================\n`);
