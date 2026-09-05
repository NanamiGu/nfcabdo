"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createProfile } from "@/data/client";
import { createClient } from "@/lib/supabase/server";
import type { ProfileInsert } from "@/types/database";
import type { Profile } from "@/types/profile";

type ActionState = {
  error: string;
};

export async function createProfileAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const type = formData.get("type");
  const name = formData.get("name");
  const slug = formData.get("slug");
  const title = formData.get("title");
  const subtitle = formData.get("subtitle");
  const bio = formData.get("bio");

  const phone = formData.get("phone");
  const whatsapp = formData.get("whatsapp");
  const email = formData.get("email");
  const website = formData.get("website");

  const status = formData.get("status");

  if (
    type !== "person" &&
    type !== "company"
  ) {
    return {
      error: "Invalid profile type.",
    };
  }

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
    status !== "active" &&
    status !== "inactive" &&
    status !== "draft"
  ) {
    return {
      error: "Invalid profile status.",
    };
  }

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

  const profileData = {
    profile: {
      name: name.trim(),
      title:
        typeof title === "string" && title.trim()
          ? title.trim()
          : undefined,
      subtitle:
        typeof subtitle === "string" && subtitle.trim()
          ? subtitle.trim()
          : undefined,
      bio:
        typeof bio === "string" && bio.trim()
          ? bio.trim()
          : undefined,
    },

    contact: {
      phone:
        typeof phone === "string" && phone.trim()
          ? phone.trim()
          : undefined,

      whatsapp:
        typeof whatsapp === "string" && whatsapp.trim()
          ? whatsapp.trim()
          : undefined,

      email:
        typeof email === "string" && email.trim()
          ? email.trim()
          : undefined,

      website:
        typeof website === "string" && website.trim()
          ? website.trim()
          : undefined,
    },

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
      showWebsite: true,
      showEmail: true,
      showPhone: true,
      showWhatsapp: true,
    },

    theme: {
      mode: "light" as const,
      primaryColor: "#000000",
      secondaryColor: "#666666",
      backgroundColor: "#ffffff",
      surfaceColor: "#f8f8f8",
      textColor: "#111111",
      mutedColor: "#666666",
      borderRadius: "medium" as const,
    },
  };

  const profile_data: Profile =
    type === "company"
      ? {
          type: "company",
          slug: normalizedSlug,
          status,
          ...profileData,
        }
      : {
          type: "person",
          slug: normalizedSlug,
          status,
          ...profileData,
        };

  let createdBy: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.id) {
      createdBy = user.id;
    }
  } catch {
    // If auth is not configured or unavailable, proceed with null
  }

  const newProfile: ProfileInsert = {
    slug: normalizedSlug,
    type,
    status,
    profile_data,
    created_by: createdBy,
  };

  const created = await createProfile(newProfile);

  if (!created) {
    return {
      error:
        "Failed to create profile. The slug may already exist or the database rejected the request.",
    };
  }

  revalidatePath("/admin");
  redirect("/admin");
}