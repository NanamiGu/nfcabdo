import { generateVCard } from "../lib/vcard.ts";
import {
  formatWhatsAppUrl,
  formatPhoneUrl,
  formatEmailUrl,
  formatMapsUrl,
  sanitizeUrl,
  RESERVED_SLUGS,
} from "../lib/urls.ts";
import {
  hasAnyContact,
  hasAnySocial,
  getInitials,
  getBorderRadiusValue,
  cn,
} from "../lib/utils.ts";
import type { Profile } from "../types/profile.ts";

console.log("=== RUNNING NFC PROFILE VERIFICATION TEST SUITE ===\n");

let passed = 0;
let total = 0;

function assert(condition: boolean, testName: string) {
  total++;
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    throw new Error(`Assertion failed for: ${testName}`);
  }
  passed++;
  console.log(`✓ PASSED: ${testName}`);
}

// 1. WhatsApp URL tests
const wa = formatWhatsAppUrl("+213 550 12 34 56", "Hello from NFC Card");
assert(
  wa === "https://wa.me/213550123456?text=Hello%20from%20NFC%20Card",
  "formatWhatsAppUrl with country code and query text"
);
assert(formatWhatsAppUrl("") === "", "formatWhatsAppUrl with empty phone");

// 2. Phone URL tests
assert(formatPhoneUrl("+213 550 12 34 56") === "tel:+213550123456", "formatPhoneUrl formatting");
assert(formatPhoneUrl("") === "", "formatPhoneUrl with empty phone");

// 3. Email URL tests
assert(
  formatEmailUrl("test@example.com", "Inquiry") === "mailto:test@example.com?subject=Inquiry",
  "formatEmailUrl with subject"
);
assert(formatEmailUrl("") === "", "formatEmailUrl with empty email");

// 4. Maps URL tests
assert(
  formatMapsUrl({ googleMapsUrl: "https://maps.google.com/?q=custom" }) ===
    "https://maps.google.com/?q=custom",
  "formatMapsUrl with explicit googleMapsUrl"
);
assert(
  formatMapsUrl({ address: "123 Main St", city: "Algiers", country: "Algeria" }).includes(
    "https://www.google.com/maps/search/?api=1&query="
  ),
  "formatMapsUrl with address components"
);
assert(formatMapsUrl(undefined) === "", "formatMapsUrl with undefined location");

// 5. URL sanitization & XSS prevention tests
assert(sanitizeUrl("https://example.com") === "https://example.com", "sanitizeUrl with https");
assert(sanitizeUrl("http://example.com") === "http://example.com", "sanitizeUrl with http");
assert(sanitizeUrl("example.com") === "https://example.com", "sanitizeUrl prefixes https");
assert(sanitizeUrl("//evil.com") === "https://evil.com", "sanitizeUrl prevents protocol-relative bypass");
assert(sanitizeUrl("javascript:alert(1)") === "", "sanitizeUrl neutralizes javascript: XSS");
assert(sanitizeUrl("data:text/html,<script>") === "", "sanitizeUrl neutralizes data: URI");
assert(sanitizeUrl("vbscript:msgbox(1)") === "", "sanitizeUrl neutralizes vbscript:");
assert(sanitizeUrl("") === "", "sanitizeUrl with empty string");
assert(sanitizeUrl(undefined) === "", "sanitizeUrl with undefined");

// 6. Initials tests
assert(getInitials("Amine Belkacem") === "AB", "getInitials two words");
assert(getInitials("ARTEX") === "AR", "getInitials single word");
assert(getInitials("John Robert Smith") === "JS", "getInitials three words (first + last)");
assert(getInitials("") === "?", "getInitials empty string");
assert(getInitials(undefined) === "?", "getInitials undefined");

// 7. Contact presence check
assert(hasAnyContact({ phone: "+213123" }), "hasAnyContact with phone");
assert(hasAnyContact({ email: "a@b.co" }), "hasAnyContact with email");
assert(!hasAnyContact({ phone: "", email: "   " }), "hasAnyContact with empty fields");
assert(!hasAnyContact(undefined), "hasAnyContact with undefined");

// 8. Social presence check
assert(hasAnySocial({ instagram: "https://instagram.com/test" }), "hasAnySocial with instagram");
assert(!hasAnySocial({ instagram: "", tiktok: "  " }), "hasAnySocial with empty strings");
assert(!hasAnySocial(undefined), "hasAnySocial with undefined");

// 9. ClassNames helper (cn)
assert(cn("px-4", false && "hidden", undefined, "py-2") === "px-4 py-2", "cn merges classes");

// 10. Border radius helper
assert(getBorderRadiusValue("small") === "0.5rem", "getBorderRadiusValue small");
assert(getBorderRadiusValue("medium") === "0.875rem", "getBorderRadiusValue medium");
assert(getBorderRadiusValue("large") === "1.25rem", "getBorderRadiusValue large");
assert(getBorderRadiusValue(undefined) === "1.25rem", "getBorderRadiusValue default");

// 11. Reserved slugs validation
assert(RESERVED_SLUGS.has("admin"), "RESERVED_SLUGS includes admin");
assert(RESERVED_SLUGS.has("api"), "RESERVED_SLUGS includes api");
assert(RESERVED_SLUGS.has("login"), "RESERVED_SLUGS includes login");

// 12. vCard 3.0 Generation - Person Profile
const testPerson: Profile = {
  type: "person",
  profile: {
    name: "Karim Ziani",
    username: "karim",
    title: "Brand Architect",
    subtitle: "Ziani Studio",
    bio: "Brand identity specialist.",
  },
  contact: {
    phone: "+213550112233",
    whatsapp: "213550112233",
    email: "karim@studio.dz",
    website: "https://karimziani.design",
  },
  location: {
    address: "Rue Didouche",
    city: "Algiers",
    country: "Algeria",
  },
  settings: {
    showAbout: true,
    showServices: false,
    showProjects: false,
    showProducts: false,
    showTestimonials: false,
    showLocation: true,
    showSocial: true,
    showBooking: false,
    showLinks: false,
    showSaveContact: true,
  },
  theme: {
    mode: "dark",
    primaryColor: "#f59e0b",
    secondaryColor: "#d97706",
    backgroundColor: "#09090b",
    borderRadius: "large",
  },
};

const vcardPerson = generateVCard(testPerson);
assert(vcardPerson.startsWith("BEGIN:VCARD\r\nVERSION:3.0"), "vCard starts with standard 3.0 header");
assert(vcardPerson.includes("FN:Karim Ziani"), "vCard includes formatted name FN");
assert(vcardPerson.includes("N:Ziani;Karim;;;"), "vCard includes structured name N");
assert(vcardPerson.includes("TITLE:Brand Architect"), "vCard includes TITLE");
assert(vcardPerson.includes("ORG:Ziani Studio"), "vCard includes ORG for person subtitle");
assert(vcardPerson.includes("TEL;TYPE=CELL,VOICE:+213550112233"), "vCard includes normalized TEL");
assert(vcardPerson.includes("EMAIL;TYPE=INTERNET,WORK:karim@studio.dz"), "vCard includes EMAIL");
assert(vcardPerson.includes("URL:https://karimziani.design"), "vCard includes URL");
assert(vcardPerson.includes("ADR;TYPE=WORK:;;Rue Didouche;Algiers;;;Algeria"), "vCard includes structured ADR");
assert(vcardPerson.includes("NOTE:Brand identity specialist."), "vCard includes bio as NOTE");
assert(vcardPerson.endsWith("END:VCARD"), "vCard ends with END:VCARD");

// 13. vCard 3.0 Generation - Company Profile
const testCompany: Profile = {
  type: "company",
  profile: {
    name: "ARTEX Agency",
    username: "artex",
    title: "Creative Agency",
  },
  contact: {
    email: "contact@artex.dz",
  },
  settings: {
    showAbout: true,
    showServices: true,
    showProjects: true,
    showProducts: false,
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
    borderRadius: "medium",
  },
};

const vcardCompany = generateVCard(testCompany);
assert(vcardCompany.includes("ORG:ARTEX Agency"), "vCard company has ORG");
assert(vcardCompany.includes("N:;ARTEX Agency;;;"), "vCard company has empty first name in N");

console.log(`\n=================================================`);
console.log(`🎉 ALL ${passed}/${total} TEST VERIFICATION SCENARIOS PASSED!`);
console.log(`=================================================\n`);
