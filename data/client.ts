import { Profile } from "@/types/profile";
import { personDemoProfile } from "./demo/person";
import { companyDemoProfile } from "./demo/company";

/**
 * ACTIVE CLIENT CONFIGURATION
 * =============================================================
 * For single-client / single-card production deployments:
 * Simply replace or update this `client` object.
 *
 * Switch to `personDemoProfile` or `companyDemoProfile`, or define
 * a new custom profile object here.
 *
 * You do NOT need to touch any UI component code!
 * =============================================================
 */
export const client: Profile = companyDemoProfile;

/**
 * Local Profile Registry for dynamic NFC routes:
 *   - /p/[username] (Personal profile)
 *   - /c/[slug]     (Company profile)
 *
 * Architecture note:
 * This registry acts as a mock database adapter. When ready to connect
 * Supabase, Prisma, MongoDB, or an external API, only `getProfileBySlug`
 * needs to be updated. The UI layer will remain 100% untouched.
 */
const profileDatabase: Record<string, Profile> = {
  // Personal profiles
  amine: personDemoProfile,

  // Company profiles
  artex: companyDemoProfile,

  // Minimal test profile for edge-case verification
  minimal: {
    type: "person",
    profile: {
      name: "Sara Nour",
      username: "minimal",
      title: "Architect",
      bio: "Crafting sustainable living spaces."
    },
    contact: {
      phone: "+213555998877",
      email: "sara@nour-arch.dz"
    },
    social: {
      instagram: "https://instagram.com/saranour"
    },
    settings: {
      showAbout: true,
      showServices: false,
      showProjects: false,
      showProducts: false,
      showTestimonials: false,
      showLocation: false,
      showSocial: true,
      showBooking: false,
      showLinks: false,
      showSaveContact: true
    },
    theme: {
      mode: "dark",
      primaryColor: "#10b981",
      secondaryColor: "#059669",
      backgroundColor: "#06130d",
      surfaceColor: "#0b2017",
      textColor: "#ecfdf5",
      mutedColor: "#6ee7b7",
      borderRadius: "medium"
    }
  }
};

/**
 * Async data fetcher for profile resolution.
 * Fully compatible with Next.js Server Components.
 */
export async function getProfileBySlug(
  slug: string,
  expectedType?: "person" | "company"
): Promise<Profile | null> {
  const normalized = slug.toLowerCase().trim();
  const profile = profileDatabase[normalized] || null;

  if (!profile) return null;
  if (expectedType && profile.type !== expectedType) {
    return null;
  }

  return profile;
}

/**
 * Returns default active client profile
 */
export async function getActiveProfile(): Promise<Profile> {
  return client;
}
