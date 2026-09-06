"use server";

import { revalidatePath } from "next/cache";
import { deleteProfile, getProfileById } from "@/data/client";
import { createClient } from "@/lib/supabase/server";

export interface DeleteProfileResult {
  success: boolean;
  error?: string;
}

/**
 * Server action to delete an NFC digital profile.
 * Ensures the requesting user is authenticated as an admin in Supabase,
 * deletes the database record, and revalidates relevant cache paths.
 */
export async function deleteProfileAction(
  id: string
): Promise<DeleteProfileResult> {
  try {
    if (!id || typeof id !== "string") {
      return { success: false, error: "Missing or invalid profile ID." };
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in as an administrator to delete profiles.",
      };
    }

    const existingProfile = await getProfileById(id);
    if (!existingProfile) {
      return { success: false, error: "Profile not found." };
    }

    const deleted = await deleteProfile(id);
    if (!deleted) {
      return {
        success: false,
        error: "Failed to delete profile from database. Please check permissions.",
      };
    }

    // Revalidate dashboard and public card routes
    revalidatePath("/admin");
    if (existingProfile.slug) {
      revalidatePath(`/${existingProfile.slug}`);
    }
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("deleteProfileAction error:", err);
    return { success: false, error: message };
  }
}
