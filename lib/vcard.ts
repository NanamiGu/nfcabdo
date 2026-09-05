import { Profile } from "@/types/profile";

/**
 * Escapes characters for vCard 3.0 formatting.
 */
function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Generates a valid vCard 3.0 string from a Profile object.
 */
export function generateVCard(profile: Profile): string {
  const { profile: info, contact, location } = profile;
  const isPerson = profile.type === "person";

  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];

  // Name formatting
  const fullName = info.name.trim();
  lines.push(`FN:${escapeVCardValue(fullName)}`);

  if (isPerson) {
    const nameParts = fullName.split(" ");
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
    const firstName = nameParts[0] || "";
    lines.push(`N:${escapeVCardValue(lastName)};${escapeVCardValue(firstName)};;;`);
  } else {
    lines.push(`N:;${escapeVCardValue(fullName)};;;`);
    lines.push(`ORG:${escapeVCardValue(fullName)}`);
  }

  // Title / Profession
  if (info.title) {
    lines.push(`TITLE:${escapeVCardValue(info.title)}`);
  }

  // Company affiliation for a person if applicable
  if (isPerson && info.subtitle) {
    lines.push(`ORG:${escapeVCardValue(info.subtitle)}`);
  }

  // Phone numbers
  if (contact.phone) {
    const cleanPhone = contact.phone.trim();
    lines.push(`TEL;TYPE=CELL,VOICE:${cleanPhone}`);
  }

  if (contact.whatsapp && contact.whatsapp !== contact.phone) {
    const cleanWhatsApp = contact.whatsapp.trim();
    lines.push(`TEL;TYPE=MSG,VOICE:${cleanWhatsApp}`);
  }

  // Email
  if (contact.email) {
    lines.push(`EMAIL;TYPE=INTERNET,WORK:${contact.email.trim()}`);
  }

  // Website
  if (contact.website) {
    lines.push(`URL:${contact.website.trim()}`);
  }

  // Address
  if (location && (location.address || location.city || location.country)) {
    const street = location.address ? escapeVCardValue(location.address) : "";
    const city = location.city ? escapeVCardValue(location.city) : "";
    const country = location.country ? escapeVCardValue(location.country) : "";
    lines.push(`ADR;TYPE=WORK:;;${street};${city};;;${country}`);
  }

  // Bio / Note
  if (info.bio) {
    lines.push(`NOTE:${escapeVCardValue(info.bio)}`);
  }

  lines.push("END:VCARD");

  return lines.join("\r\n");
}

/**
 * Initiates the download of a .vcf file in the browser.
 * Tested across iOS Safari, Android Chrome, and Desktop browsers.
 */
export function downloadVCard(profile: Profile): void {
  if (typeof window === "undefined") return;

  const vcardData = generateVCard(profile);
  const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8" });

  const safeFilename = `${(profile.profile.username || profile.profile.name || "contact")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")}.vcf`;

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", safeFilename);
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 200);
}
