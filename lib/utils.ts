import { ProfileContact, ProfileSocial } from "@/types/profile";

/**
 * Combines conditional class names cleanly
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Extracts 1-2 uppercase initials from a name for fallback avatars/logos
 */
export function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Checks if at least one contact method is configured and non-empty
 */
export function hasAnyContact(contact?: ProfileContact): boolean {
  if (!contact) return false;
  return Boolean(
    (contact.phone && contact.phone.trim()) ||
    (contact.whatsapp && contact.whatsapp.trim()) ||
    (contact.email && contact.email.trim()) ||
    (contact.website && contact.website.trim())
  );
}

/**
 * Checks if at least one social media link is configured and non-empty
 */
export function hasAnySocial(social?: ProfileSocial): boolean {
  if (!social) return false;
  return Object.values(social).some((val) => typeof val === "string" && val.trim().length > 0);
}

/**
 * Maps border radius config to CSS border-radius value
 */
export function getBorderRadiusValue(radius?: "small" | "medium" | "large"): string {
  switch (radius) {
    case "small":
      return "0.5rem"; // 8px
    case "medium":
      return "0.875rem"; // 14px
    case "large":
    default:
      return "1.25rem"; // 20px
  }
}
