import { Profile } from "@/types/profile";
import { createClient } from "../lib/supabase/server";
import type {
  ProfileRow,
  ProfileInsert,
  ProfileUpdate,
} from "@/types/database";

/**
 * Convert a Supabase database row into the application's Profile type.
 */
function mapDatabaseProfile(row: ProfileRow): Profile {
  const base = {
    ...row.profile_data,
    id: row.id,
    slug: row.slug,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  return row.type === "company"
    ? { ...base, type: "company" }
    : { ...base, type: "person" };
}

/**
 * Get a profile by its slug.
 *
 * Example:
 * /artex
 * -> slug = "artex"
 *
 * Only active profiles are publicly accessible.
 */
export async function getProfileBySlug(
  slug: string,
  expectedType?: "person" | "company"
): Promise<Profile | null> {
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select(
      "id, slug, type, status, profile_data, created_by, created_at, updated_at"
    )
    .eq("slug", slug)
    .eq("status", "active");

  if (expectedType) {
    query = query.eq("type", expectedType);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return mapDatabaseProfile(data);
}

/**
 * Get a profile by its ID.
 *
 * Used by the Admin Dashboard for editing profiles of any status.
 */
export async function getProfileById(id: string): Promise<Profile | null> {
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
    return null;
  }

  if (!data) {
    return null;
  }

  return mapDatabaseProfile(data);
}

/**
 * Get the active profile used by the root NFC page.
 *
 * NOTE:
 * This is mainly useful for the current root/demo page.
 * The production customer pages should use /[slug].
 */
export async function getActiveProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, slug, type, status, profile_data, created_by, created_at, updated_at"
    )
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching active profile:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return mapDatabaseProfile(data);
}

/**
 * Get all profiles.
 *
 * This function is intended for the Admin Dashboard.
 * It should NOT be used directly by public profile pages.
 */
export async function getProfiles(): Promise<Profile[]> {
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
 * This will later be restricted to Admin users through RLS/Auth.
 */
export async function deleteProfile(id: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting profile:", error);
    return false;
  }

  return true;
}