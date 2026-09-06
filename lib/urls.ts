import type { ProfileLocation } from "@/types/profile";

export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "login",
  "_next",
  "static",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "images",
  "avatars",
  "icons",
  "profiles",
]);

/**
 * Normalizes a phone number for WhatsApp link (wa.me)
 * Strips all non-digit characters (+, spaces, hyphens, parentheses).
 */
export function formatWhatsAppUrl(phone: string, text?: string): string {
  const cleanNumber = phone.replace(/\D/g, "");
  if (!cleanNumber) return "";
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${cleanNumber}${query}`;
}

/**
 * Creates a standard tel: link
 */
export function formatPhoneUrl(phone: string): string {
  const clean = phone.replace(/[^\d+]/g, "");
  return clean ? `tel:${clean}` : "";
}

/**
 * Creates a standard mailto: link
 */
export function formatEmailUrl(email: string, subject?: string): string {
  if (!email) return "";
  const cleanEmail = email.trim();
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${cleanEmail}${query}`;
}

/**
 * Creates a Google Maps search URL from a location object
 */
export function formatMapsUrl(location?: ProfileLocation): string {
  if (!location) return "";
  if (location.googleMapsUrl && location.googleMapsUrl.trim()) {
    return location.googleMapsUrl.trim();
  }

  const queryParts = [location.address, location.city, location.country].filter(
    (p): p is string => Boolean(p && p.trim())
  );

  if (queryParts.length === 0) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    queryParts.join(", ")
  )}`;
}

/**
 * Sanitizes and ensures external URLs start with https:// or http://
 * Disallows dangerous pseudo-protocols (javascript:, vbscript:, data:, blob:, file:)
 * Preserves safe relative paths (/path).
 */
export function sanitizeUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  // Remove control characters and whitespace when testing protocol
  const normalizedProtocol = trimmed
    .replace(/[\u0000-\u001F\u007F-\u009F\s]/g, "")
    .toLowerCase();

  // Neutralize dangerous pseudo-protocols
  if (/^(javascript|vbscript|data|blob|file):/i.test(normalizedProtocol)) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  // Safe relative paths
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
