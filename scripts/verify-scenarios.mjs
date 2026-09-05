import { generateVCard } from "../lib/vcard.js";
import { formatWhatsAppUrl, formatPhoneUrl, formatEmailUrl, formatMapsUrl } from "../lib/urls.js";
import { hasAnyContact, hasAnySocial, getInitials } from "../lib/utils.js";

console.log("=== RUNNING NFC PROFILE VERIFICATION SCENARIOS ===");

// 1. WhatsApp link test
const wa = formatWhatsAppUrl("+213 550 12 34 56", "Hello from NFC Card");
console.log("WhatsApp URL:", wa);
if (!wa.startsWith("https://wa.me/213550123456?text=")) {
  throw new Error("WhatsApp format failed");
}

// 2. Initials test
if (getInitials("Amine Belkacem") !== "AB" || getInitials("ARTEX") !== "AR") {
  throw new Error("Initials generation failed");
}

// 3. Contacts validation test
if (!hasAnyContact({ phone: "+213123" })) throw new Error("Contact check failed");
if (hasAnyContact({ phone: "", email: "" })) throw new Error("Empty contact check failed");

// 4. Social validation test
if (!hasAnySocial({ instagram: "https://instagram.com" })) throw new Error("Social check failed");
if (hasAnySocial({ instagram: "", tiktok: "" })) throw new Error("Empty social check failed");

console.log("ALL LOGICAL AND DATA VERIFICATION SCENARIOS PASSED!");
