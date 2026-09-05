import { Profile } from "@/types/profile";
import { createClient } from "../lib/supabse/server";

/**
 * Convert a Supabase database row into the application's Profile type.
 */
function mapDatabaseProfile(row: any): Profile {
  return {
    ...row.profile_data,

    id: row.id,
    slug: row.slug,
    type: row.type,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  } as Profile;
}

/**
 * Get a profile by its slug.
 *
 * Example:
 * /artex
 * -> slug = "artex"
 */
export async function getProfileBySlug(
  slug: string,
  expectedType?: "person" | "company"
): Promise<Profile | null> {
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select(
      "id, slug, type, status, profile_data, created_at, updated_at"
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
 * Get the active profile used by the root NFC page.
 *
 * This replaces the old:
 * export const client = artexProfile;
 */
export async function getActiveProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, slug, type, status, profile_data, created_at, updated_at")
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