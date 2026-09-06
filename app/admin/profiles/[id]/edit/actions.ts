"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateProfile, getProfileById } from "@/data/client";
import { createClient } from "@/lib/supabase/server";
import { RESERVED_SLUGS } from "@/lib/urls";
import type { ProfileUpdate } from "@/types/database";
import type { Profile, ProfileType, ProfileStatus } from "@/types/profile";

export interface UpdateProfileResult {
  success: boolean;
  error?: string;
  slug?: string;
}

/**
 * Direct typed Server Action for updating a full profile payload
 * from the NFC Profile Builder.
 */
export async function updateProfileFullAction(
  id: string,
  profile: Profile,
  targetStatus: "draft" | "active"
): Promise<UpdateProfileResult> {
  try {
    if (!id || typeof id !== "string") {
      return { success: false, error: "Missing profile ID." };
    }

    const existingProfile = await getProfileById(id);
    if (!existingProfile) {
      return { success: false, error: "Profile not found." };
    }

    const rawSlug = profile.slug || profile.profile.name;
    if (!rawSlug || typeof rawSlug !== "string" || !rawSlug.trim()) {
      return { success: false, error: "Profile URL slug is required." };
    }

    if (!profile.profile.name?.trim()) {
      return { success: false, error: "Name is required." };
    }

    const normalizedSlug = rawSlug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!normalizedSlug) {
      return { success: false, error: "Invalid slug." };
    }

    if (RESERVED_SLUGS.has(normalizedSlug)) {
      return {
        success: false,
        error: `The URL slug "${normalizedSlug}" is reserved for system routes. Please choose a different slug.`,
      };
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in as an administrator to update profiles.",
      };
    }

    // Check slug uniqueness against OTHER profiles
    const { data: conflict } = await supabase
      .from("profiles")
      .select("id")
      .eq("slug", normalizedSlug)
      .neq("id", id)
      .maybeSingle();

    if (conflict) {
      return {
        success: false,
        error: `The URL slug "${normalizedSlug}" is already in use by another profile.`,
      };
    }

    const fullProfileData: Profile = {
      ...profile,
      id,
      slug: normalizedSlug,
      status: targetStatus,
      updatedAt: new Date().toISOString(),
    };

    const updates: ProfileUpdate = {
      slug: normalizedSlug,
      type: profile.type,
      status: targetStatus,
      profile_data: fullProfileData,
      updated_at: new Date().toISOString(),
    };

    const updated = await updateProfile(id, updates);

    if (!updated) {
      return {
        success: false,
        error: "Failed to update profile in database.",
      };
    }

    revalidatePath("/admin");
    revalidatePath(`/${normalizedSlug}`);
    if (existingProfile.slug && existingProfile.slug !== normalizedSlug) {
      revalidatePath(`/${existingProfile.slug}`);
    }

    return { success: true, slug: normalizedSlug };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected update error.";
    console.error("updateProfileFullAction error:", err);
    return { success: false, error: message };
  }
}

type LegacyActionState = {
  error: string;
};

export async function updateProfileAction(
  _previousState: LegacyActionState,
  formData: FormData
): Promise<LegacyActionState> {
  const id = formData.get("id");
  if (!id || typeof id !== "string") {
    return { error: "Missing profile ID." };
  }

  const existingProfile = await getProfileById(id);
  if (!existingProfile) {
    return { error: "Profile not found." };
  }

  const typeRaw = formData.get("type");
  const name = formData.get("name");
  const slug = formData.get("slug");
  const statusRaw = formData.get("status");

  if (typeRaw !== "person" && typeRaw !== "company") {
    return { error: "Invalid profile type." };
  }
  const type: ProfileType = typeRaw;

  if (!name || typeof name !== "string" || !name.trim()) {
    return { error: "Name is required." };
  }

  if (!slug || typeof slug !== "string" || !slug.trim()) {
    return { error: "Slug is required." };
  }

  const status: ProfileStatus =
    statusRaw === "active" || statusRaw === "draft" || statusRaw === "inactive"
      ? statusRaw
      : "active";

  const res = await updateProfileFullAction(
    id,
    {
      ...existingProfile,
      type,
      profile: { ...existingProfile.profile, name: name.trim() },
    },
    status === "inactive" ? "draft" : status
  );

  if (!res.success) {
    return { error: res.error || "Failed to update profile." };
  }

  revalidatePath("/admin");
  redirect("/admin");
}
