"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateProfile, getProfileById } from "@/data/client";
import type { ProfileUpdate } from "@/types/database";
import type { Profile, ProfileType, ProfileStatus } from "@/types/profile";

type ActionState = {
  error: string;
};

export async function updateProfileAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id");
  if (!id || typeof id !== "string") {
    return {
      error: "Missing profile ID.",
    };
  }

  const existingProfile = await getProfileById(id);
  if (!existingProfile) {
    return {
      error: "Profile not found.",
    };
  }

  const typeRaw = formData.get("type");
  const name = formData.get("name");
  const slug = formData.get("slug");
  const title = formData.get("title");
  const subtitle = formData.get("subtitle");
  const bio = formData.get("bio");

  const phone = formData.get("phone");
  const whatsapp = formData.get("whatsapp");
  const email = formData.get("email");
  const website = formData.get("website");

  const statusRaw = formData.get("status");

  if (typeRaw !== "person" && typeRaw !== "company") {
    return {
      error: "Invalid profile type.",
    };
  }
  const type: ProfileType = typeRaw;

  if (!name || typeof name !== "string" || !name.trim()) {
    return {
      error: "Name is required.",
    };
  }

  if (!slug || typeof slug !== "string" || !slug.trim()) {
    return {
      error: "Slug is required.",
    };
  }

  if (
    statusRaw !== "active" &&
    statusRaw !== "inactive" &&
    statusRaw !== "draft"
  ) {
    return {
      error: "Invalid profile status.",
    };
  }
  const status: ProfileStatus = statusRaw;

  const normalizedSlug = slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!normalizedSlug) {
    return {
      error: "Invalid slug.",
    };
  }

  const profileInfo = {
    ...existingProfile.profile,
    name: name.trim(),
    title: typeof title === "string" && title.trim() ? title.trim() : undefined,
    subtitle: typeof subtitle === "string" && subtitle.trim() ? subtitle.trim() : undefined,
    bio: typeof bio === "string" && bio.trim() ? bio.trim() : undefined,
  };

  const contactInfo = {
    ...existingProfile.contact,
    phone: typeof phone === "string" && phone.trim() ? phone.trim() : undefined,
    whatsapp: typeof whatsapp === "string" && whatsapp.trim() ? whatsapp.trim() : undefined,
    email: typeof email === "string" && email.trim() ? email.trim() : undefined,
    website: typeof website === "string" && website.trim() ? website.trim() : undefined,
  };

  const baseUpdated = {
    ...existingProfile,
    slug: normalizedSlug,
    status,
    profile: profileInfo,
    contact: contactInfo,
    updatedAt: new Date().toISOString(),
  };

  const profile_data: Profile =
    type === "company"
      ? {
          ...baseUpdated,
          type: "company",
        }
      : {
          ...baseUpdated,
          type: "person",
        };

  const updates: ProfileUpdate = {
    slug: normalizedSlug,
    type,
    status,
    profile_data,
    updated_at: new Date().toISOString(),
  };

  const updated = await updateProfile(id, updates);

  if (!updated) {
    return {
      error:
        "Failed to update profile. The slug may already be in use by another profile.",
    };
  }

  revalidatePath("/admin");
  revalidatePath(`/${normalizedSlug}`);
  if (existingProfile.slug && existingProfile.slug !== normalizedSlug) {
    revalidatePath(`/${existingProfile.slug}`);
  }
  redirect("/admin");
}
