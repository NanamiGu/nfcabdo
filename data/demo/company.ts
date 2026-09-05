import { Profile } from "@/types/profile";

export const companyDemoProfile: Profile = {
  type: "company",

  profile: {
    name: "ARTEX Creative Agency",
    username: "artex",
    logo: "/images/artex-logo.svg",
    coverImage: "/images/artex-cover.svg",
    title: "Global Creative & Digital Agency",
    subtitle: "Branding • Web Architecture • Immersive Experiences",
    bio: "We craft iconic visual identities, bespoke web platforms, and digital brand experiences that drive exponential business value.",
    verified: true,
    founded: "2021",
    mission: "To bridge strategic brand thinking with hyper-refined engineering."
  },

  contact: {
    phone: "+213555001122",
    whatsapp: "213555001122",
    email: "hello@artex-agency.com",
    website: "https://artex-agency.com"
  },

  social: {
    instagram: "https://instagram.com/artex.agency",
    linkedin: "https://linkedin.com/company/artex-agency",
    x: "https://x.com/artex_agency",
    facebook: "https://facebook.com/artex.creative",
    youtube: "https://youtube.com/@artexagency"
  },

  location: {
    address: "14 Boulevard des Martyrs",
    city: "Algiers",
    country: "Algeria",
    googleMapsUrl: "https://maps.google.com/?q=Algiers"
  },

  services: [
    {
      title: "Strategic Brand Identity",
      description: "Complete visual positioning, logo systems, brand guidelines, and distinctive typographic hierarchy.",
      icon: "sparkles",
      price: "From $4,000"
    },
    {
      title: "High-End Web Experiences",
      description: "Flagship corporate websites, 3D interactive web apps, and headless e-commerce built on Next.js.",
      icon: "globe",
      price: "From $6,500"
    },
    {
      title: "Digital Product Design",
      description: "End-to-end UX wireframing, high-fidelity prototypes, and comprehensive design systems.",
      icon: "layers",
      price: "From $3,500"
    },
    {
      title: "CGI & Motion Direction",
      description: "3D product rendering, brand launch films, and interactive micro-animations that captivate.",
      icon: "film",
      price: "From $2,800"
    }
  ],

  projects: [
    {
      title: "Aura Haute Horlogerie",
      description: "Luxury Swiss timepiece brand launch, interactive 3D configurator, and global e-commerce flag.",
      category: "Branding & Web",
      image: "/images/project-1.svg",
      url: "https://artex-agency.com/work/aura",
      featured: true
    },
    {
      title: "NeoBank Horizon",
      description: "Complete brand transformation and mobile banking interface for 500k+ active users.",
      category: "Fintech Rebrand",
      image: "/images/project-2.svg",
      url: "https://artex-agency.com/work/horizon"
    },
    {
      title: "Solstice Architecture Group",
      description: "Minimalist architectural monograph and responsive portfolio with spatial layout rhythm.",
      category: "Digital Experience",
      image: "/images/project-3.svg",
      url: "https://artex-agency.com/work/solstice"
    }
  ],

  products: [
    {
      title: "Artex Brand Sprint Guide",
      description: "Our proprietary 5-day brand sprint framework used by top industry leaders.",
      price: "$199",
      badge: "Agency Toolkit",
      url: "https://artex-agency.com/resources/brand-sprint"
    }
  ],

  testimonials: [
    {
      quote: "ARTEX reimagined our brand presence from the ground up. Their attention to craft and technical execution is unmatched.",
      author: "Elena Rostova",
      role: "Chief Marketing Officer",
      company: "Aura Timepieces",
      rating: 5
    },
    {
      quote: "Working with ARTEX was effortless. The website is an absolute work of art and delivers stellar conversion metrics.",
      author: "David Chen",
      role: "Managing Director",
      company: "NeoBank Horizon",
      rating: 5
    }
  ],

  links: [
    {
      title: "Explore Full 2026 Agency Showreel",
      description: "Watch our curated case studies and motion highlights (2 min)",
      url: "https://artex-agency.com/showreel",
      icon: "play-circle",
      highlight: true
    },
    {
      title: "Download Agency Capabilities Deck",
      description: "28-page PDF overview of team, process, and verified client outcomes",
      url: "https://artex-agency.com/deck.pdf",
      icon: "download",
      highlight: false
    }
  ],

  booking: {
    enabled: true,
    url: "https://cal.com/artex-studio/discovery",
    title: "Schedule a Brand Discovery Call",
    description: "Meet with our creative director to discuss scope, timeline, and deliverables."
  },

  extra: {
    catalogUrl: "https://artex-agency.com/deck.pdf",
    portfolioUrl: "https://artex-agency.com/work"
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
    showSaveContact: true
  },

  theme: {
    mode: "dark",
    primaryColor: "#f59e0b",
    secondaryColor: "#e11d48",
    backgroundColor: "#09090b",
    surfaceColor: "#141417",
    textColor: "#fafafa",
    mutedColor: "#a1a1aa",
    borderRadius: "large"
  }
};
