"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createProfile } from "@/data/client";
import { createClient } from "@/lib/supabase/server";
import type { ProfileInsert } from "@/types/database";
import type { Profile } from "@/types/profile";

export interface SaveProfileResult {
  success: boolean;
  error?: string;
  slug?: string;
}

/**
 * Direct typed Server Action for saving a full Profile payload
 * from the NFC Profile Builder.
 */
export async function saveProfileFullAction(
  profile: Profile,
  targetStatus: "draft" | "active"
): Promise<SaveProfileResult> {
  try {
    const rawSlug = profile.slug || profile.profile.name;
    if (!rawSlug || typeof rawSlug !== "string" || !rawSlug.trim()) {
      return {
        success: false,
        error: "Profile URL slug is required.",
      };
    }

    if (!profile.profile.name?.trim()) {
      return {
        success: false,
        error: "Full name or company name is required.",
      };
    }

    const normalizedSlug = rawSlug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!normalizedSlug) {
      return {
        success: false,
        error: "Invalid slug. Must contain letters, numbers, or hyphens.",
      };
    }

    const supabase = await createClient();

    // Check slug uniqueness before insert
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("slug", normalizedSlug)
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        error: `The URL slug "${normalizedSlug}" is already in use. Please enter a unique slug.`,
      };
    }

    let createdBy: string | null = null;
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) {
        createdBy = user.id;
      }
    } catch {
      // Proceed without user if auth is optional/unconfigured
    }

    // Assemble complete profile payload
    const fullProfileData: Profile = {
      ...profile,
      slug: normalizedSlug,
      status: targetStatus,
    };

    const newProfile: ProfileInsert = {
      slug: normalizedSlug,
      type: profile.type,
      status: targetStatus,
      profile_data: fullProfileData,
      created_by: createdBy,
    };

    const created = await createProfile(newProfile);

    if (!created) {
      return {
        success: false,
        error: "Database failed to save the profile. Please check credentials and try again.",
      };
    }

    revalidatePath("/admin");
    revalidatePath(`/${normalizedSlug}`);

    return {
      success: true,
      slug: normalizedSlug,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error saving profile.";
    console.error("SaveProfileFullAction error:", err);
    return {
      success: false,
      error: message,
    };
  }
}

type LegacyActionState = {
  error: string;
};

/**
 * Backward-compatible Form action handler
 */
export async function createProfileAction(
  _previousState: LegacyActionState,
  formData: FormData
): Promise<LegacyActionState> {
  const type = formData.get("type");
  const name = formData.get("name");
  const slug = formData.get("slug");
  const status = (formData.get("status") as "draft" | "active") || "active";

  if (type !== "person" && type !== "company") {
    return { error: "Invalid profile type." };
  }
  if (!name || typeof name !== "string" || !name.trim()) {
    return { error: "Name is required." };
  }
  if (!slug || typeof slug !== "string" || !slug.trim()) {
    return { error: "Slug is required." };
  }

  const normalizedSlug = slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  const result = await saveProfileFullAction(
    {
      type,
      slug: normalizedSlug,
      status,
      profile: { name: name.trim() },
      contact: {},
      settings: {
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
      },
      theme: {
        mode: "dark",
        primaryColor: "#38bdf8",
        secondaryColor: "#818cf8",
        backgroundColor: "#09090b",
        surfaceColor: "#18181b",
        textColor: "#fafafa",
        mutedColor: "#a1a1aa",
        borderRadius: "large",
      },
    },
    status
  );

  if (!result.success) {
    return { error: result.error || "Failed to create profile." };
  }

  revalidatePath("/admin");
  redirect("/admin");
}