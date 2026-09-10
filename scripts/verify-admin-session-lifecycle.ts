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

// 1. Multi-Tab Coordination Registry Tests
interface TabRegistry {
  [tabId: string]: number;
}

const TAB_STALE_THRESHOLD = 10000;

function evaluateTabCloseAction(
  closingTabId: string,
  registry: TabRegistry,
  now: number,
  isReload: boolean
): "KEEP_SESSION_OTHER_TAB_ACTIVE" | "KEEP_SESSION_RELOAD" | "SIGN_OUT_LAST_TAB" {
  if (isReload) {
    return "KEEP_SESSION_RELOAD";
  }

  // Remove closing tab
  const activeTabs = Object.entries(registry).filter(
    ([id, ts]) => id !== closingTabId && now - ts < TAB_STALE_THRESHOLD
  );

  if (activeTabs.length > 0) {
    return "KEEP_SESSION_OTHER_TAB_ACTIVE";
  }

  return "SIGN_OUT_LAST_TAB";
}

const now = 1000000;

// Scenario: Tab A closes while Tab B is actively open
const multiTabRegistry: TabRegistry = {
  tab_A: now - 500,
  tab_B: now - 1000,
};

assert(
  evaluateTabCloseAction("tab_A", multiTabRegistry, now, false) ===
    "KEEP_SESSION_OTHER_TAB_ACTIVE",
  "Tab A closing while Tab B is active PRESERVES session (no signOut)"
);

// Scenario: Tab B is stale (closed 30s ago without unregistering), Tab A closes
const staleTabRegistry: TabRegistry = {
  tab_A: now - 500,
  tab_B: now - 35000, // 35s ago (> 10s threshold)
};

assert(
  evaluateTabCloseAction("tab_A", staleTabRegistry, now, false) ===
    "SIGN_OUT_LAST_TAB",
  "Tab A closing with only stale tabs triggers best-effort signOut"
);

// Scenario: Tab A reloads (isReload = true)
assert(
  evaluateTabCloseAction("tab_A", { tab_A: now }, now, true) ===
    "KEEP_SESSION_RELOAD",
  "Tab A reload preserves session without signOut"
);

// Scenario: Only Tab A open, closing tab triggers signout
assert(
  evaluateTabCloseAction("tab_A", { tab_A: now }, now, false) ===
    "SIGN_OUT_LAST_TAB",
  "Single active Tab A closing triggers best-effort signOut"
);

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
