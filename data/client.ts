import { Profile } from "@/types/profile";
import { artexProfile } from "./profiles/artex";
import { amineProfile } from "./profiles/amine";
import { minimalProfile } from "./profiles/minimal";
import { getProfileFromRegistry } from "./registry";

/**
 * ACTIVE CLIENT CONFIGURATION
 * =============================================================
 * For single-client / single-card production deployments:
 * Change `client` to whatever profile should be the active root card.
 *
 * You do NOT need to touch any UI component code!
 * =============================================================
 */
export const client: Profile = artexProfile;

// Backward-compatibility exports
export const personDemoProfile = amineProfile;
export const companyDemoProfile = artexProfile;
export { amineProfile, artexProfile, minimalProfile };

/**
 * Async data fetcher for profile resolution.
 * Fully compatible with Next.js Server Components.
 *
 * Later, this function can query Prisma / Supabase / Postgres:
 *   const profile = await db.profile.findUnique({ where: { slug } });
 *   return profile;
 */
export async function getProfileBySlug(
  slug: string,
  expectedType?: "person" | "company"
): Promise<Profile | null> {
  // Currently pulls from local registry.
  // Ready to be replaced by DB adapter without changing UI code.
  return getProfileFromRegistry(slug, expectedType);
}

/**
 * Returns default active client profile for root / NFC access
 */
export async function getActiveProfile(): Promise<Profile> {
  return client;
}
