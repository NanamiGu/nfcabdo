import { Profile } from "@/types/profile";
import { createClient } from "../lib/supabase/server";
import { getProfileFromRegistry } from "./registry";
import type {
  ProfileRow,
  ProfileInsert,
  ProfileUpdate,
} from "@/types/database";

const defaultProfileSettings = {
  showAbout: true,
  showServices: true,
  showProjects: true,
  showProducts: true,
  showTestimonials: true,
  showLocation: true,
  showSocial: true,
  showBooking: true,
  showLinks: true,
  showSaveContact: true,
};

const defaultProfileTheme = {
  mode: "dark" as const,
  primaryColor: "#38bdf8",
  secondaryColor: "#818cf8",
  backgroundColor: "#09090b",
  surfaceColor: "#18181b",
  textColor: "#fafafa",
  mutedColor: "#a1a1aa",
  borderRadius: "large" as const,
};

/**
 * Convert a Supabase database row into the application's Profile type.
 */
function mapDatabaseProfile(row: ProfileRow): Profile {
  const profileData = row.profile_data || {};
  const base = {
    ...profileData,
    id: row.id,
    slug: row.slug,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    profile: {
      ...(profileData.profile || {}),
      name: profileData.profile?.name || row.slug || "Unnamed Profile",
    },
    contact: profileData.contact || {},
    settings: {
      ...defaultProfileSettings,
      ...(profileData.settings || {}),
    },
    theme: {
      ...defaultProfileTheme,
      ...(profileData.theme || {}),
    },
  };

  return row.type === "company"
    ? { ...base, type: "company" }
    : { ...base, type: "person" };
}

function isDynamicServerError(err: unknown): boolean {
  if (typeof err === "object" && err !== null && "digest" in err) {
    const digest = (err as { digest?: unknown }).digest;
    return typeof digest === "string" && digest.startsWith("DYNAMIC_SERVER_USAGE");
  }
  return false;
}

/**
 * Get a profile by its slug.
 *
 * Example:
 * /artex
 * -> slug = "artex"
 *
 * Checks database first, then falls back to local registry.
 */
export async function getProfileBySlug(
  slug: string,
  expectedType?: "person" | "company"
): Promise<Profile | null> {
  const normalizedSlug = slug.trim().toLowerCase();

  try {
    const supabase = await createClient();

    let query = supabase
      .from("profiles")
      .select(
        "id, slug, type, status, profile_data, created_by, created_at, updated_at"
      )
      .eq("slug", normalizedSlug)
      .eq("status", "active");

    if (expectedType) {
      query = query.eq("type", expectedType);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error("Error fetching profile from database:", error);
    } else if (data) {
      return mapDatabaseProfile(data);
    }
  } catch (err) {
    if (isDynamicServerError(err)) throw err;
    console.error("Database query error in getProfileBySlug:", err);
  }

  return getProfileFromRegistry(normalizedSlug, expectedType);
}

/**
 * Get a profile by its ID.
 *
 * Used by the Admin Dashboard for editing profiles of any status.
 */
export async function getProfileById(id: string): Promise<Profile | null> {
  if (!id || typeof id !== "string") return null;

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, slug, type, status, profile_data, created_by, created_at, updated_at"
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile by ID:", error);
    } else if (data) {
      return mapDatabaseProfile(data);
    }
  } catch (err) {
    if (isDynamicServerError(err)) throw err;
    console.error("Database query error in getProfileById:", err);
  }

  if (id === "prof_artex_01") return getProfileFromRegistry("artex");
  if (id === "prof_amine_01") return getProfileFromRegistry("amine");
  if (id === "prof_minimal_01") return getProfileFromRegistry("minimal");

  return null;
}

/**
 * Get the active profile used by the root NFC page.
 *
 * Queries latest active profile from database, or falls back to demo profile.
 */
export async function getActiveProfile(): Promise<Profile | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, slug, type, status, profile_data, created_by, created_at, updated_at"
      )
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching active profile:", error);
    } else if (data) {
      return mapDatabaseProfile(data);
    }
  } catch (err) {
    if (isDynamicServerError(err)) throw err;
    console.error("Database query error in getActiveProfile:", err);
  }

  return getProfileFromRegistry("artex") || getProfileFromRegistry("amine");
}

/**
 * Get all profiles.
 *
 * This function is intended for the Admin Dashboard.
 * It should NOT be used directly by public profile pages.
 */
export async function getProfiles(): Promise<Profile[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, slug, type, status, profile_data, created_by, created_at, updated_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching profiles:", error);
      return [];
    }

    return data.map((row) => mapDatabaseProfile(row));
  } catch (err) {
    if (isDynamicServerError(err)) throw err;
    console.error("Failed to fetch profiles in getProfiles:", err);
    return [];
  }
}

/**
 * Create a new profile.
 *
 * This will be used later by the Admin Dashboard.
 */
export async function createProfile(
  profile: ProfileInsert
): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .insert(profile)
    .select(
      "id, slug, type, status, profile_data, created_by, created_at, updated_at"
    )
    .single();

  if (error) {
    console.error("Error creating profile:", error);
    return null;
  }

  return mapDatabaseProfile(data);
}

/**
 * Update an existing profile.
 *
 * Only fields defined in ProfileUpdate can be changed.
 */
export async function updateProfile(
  id: string,
  updates: ProfileUpdate
): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select(
      "id, slug, type, status, profile_data, created_by, created_at, updated_at"
    )
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    return null;
  }

  return mapDatabaseProfile(data);
}

/**
 * Delete a profile.
 *
 * Restricted to Admin users through RLS/Auth.
 */
export async function deleteProfile(id: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      console.error("Error deleting profile:", error);
      return false;
    }

    if (!data || data.length === 0) {
      console.warn("deleteProfile: No profile found or deleted for id:", id);
      return false;
    }

    return true;
  } catch (err) {
    if (isDynamicServerError(err)) throw err;
    console.error("Database query error in deleteProfile:", err);
    return false;
  }
}