import { createClient } from "./client";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Upload a file to the Supabase 'profiles' storage bucket
 * Returns the public URL of the uploaded file
 */
export async function uploadProfileMedia(
  file: File,
  folder: "avatars" | "covers" | "projects" | "products" | "resources" | "logos" = "avatars"
): Promise<{ url: string | null; error: string | null }> {
  try {
    if (!file) {
      return { url: null, error: "No file provided." };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { url: null, error: "File size exceeds the 5MB limit." };
    }

    if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
      return {
        url: null,
        error: "Invalid file format. Only JPEG, PNG, WebP, SVG, and GIF images are allowed.",
      };
    }

    const supabase = createClient();
    const rawExt = file.name.split(".").pop()?.toLowerCase() || "png";
    const fileExt = rawExt.replace(/[^a-z0-9]/g, "") || "png";
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `${folder}/${timestamp}-${randomStr}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage.from("profiles").getPublicUrl(fileName);
    return { url: data.publicUrl, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown upload error";
    console.error("Upload error:", err);
    return { url: null, error: message };
  }
}
