import { PersonProfile } from "@/types/profile";

export const minimalProfile: PersonProfile = {
  type: "person",
  id: "prof_minimal_01",
  slug: "minimal",
  status: "active",
  language: "en",

  profile: {
    name: "Sara Nour",
    username: "minimal",
    title: "Architect",
    bio: "Crafting sustainable living spaces with clean architectural rhythm.",
  },

  contact: {
    phone: "+213555998877",
    email: "sara@nour-arch.dz",
  },

  social: {
    instagram: "https://instagram.com/saranour",
  },

  settings: {
    showAbout: true,
    showServices: false,
    showProjects: false,
    showProducts: false,
    showTestimonials: false,
    showLocation: false,
    showSocial: true,
    showBooking: false,
    showLinks: false,
    showSaveContact: true,
    showPhone: true,
    showWhatsapp: false,
    showEmail: false,
    showWebsite: false,
  },

  theme: {
    mode: "dark",
    primaryColor: "#10b981",
    secondaryColor: "#059669",
    backgroundColor: "#06130d",
    surfaceColor: "#0b2017",
    textColor: "#ecfdf5",
    mutedColor: "#6ee7b7",
    borderRadius: "medium",
  },
};
