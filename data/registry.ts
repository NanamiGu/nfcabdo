import { Profile } from "@/types/profile";
import { amineProfile } from "./profiles/amine";
import { artexProfile } from "./profiles/artex";
import { minimalProfile } from "./profiles/minimal";

/**
 * Local Profile Registry
 * Maps username/slug identifiers to their strongly-typed profile definitions.
 *
 * In a future database setup (Supabase, Prisma, PostgreSQL), this registry
 * will be replaced or supplemented by async database queries.
 */
export const profileRegistry: Record<string, Profile> = {
  amine: amineProfile,
  artex: artexProfile,
  minimal: minimalProfile,
};

import { RESERVED_SLUGS } from "@/lib/urls";

/**
 * Resolve a profile by identifier and optional expected type.
 * Supports both personal and company profiles at clean root URLs (/[slug]).
 */
export function getProfileFromRegistry(
  slug: string,
  expectedType?: "person" | "company"
): Profile | null {
  const normalized = slug.toLowerCase().trim();
  if (RESERVED_SLUGS.has(normalized)) {
    return null;
  }

  const profile = profileRegistry[normalized] || null;

  if (!profile) return null;
  if (expectedType && profile.type !== expectedType) {
    return null;
  }

  return profile;
}
