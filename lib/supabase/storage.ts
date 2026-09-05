import { createClient } from "./client";

/**
 * Upload a file to the Supabase 'profiles' storage bucket
 * Returns the public URL of the uploaded file
 */
export async function uploadProfileMedia(
  file: File,
  folder: "avatars" | "covers" | "projects" | "products" | "resources" | "logos" = "avatars"
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "png";
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
