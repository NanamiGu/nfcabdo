import { PersonProfile } from "@/types/profile";

export const amineProfile: PersonProfile = {
  type: "person",
  id: "prof_amine_01",
  slug: "amine",
  status: "active",
  language: "en",
  createdAt: "2026-01-15T10:00:00Z",

  profile: {
    name: "Amine Belkacem",
    username: "amine",
    avatar: "/images/amine-avatar.svg",
    title: "Senior Frontend Developer",
    subtitle: "React • Next.js • Design Systems",
    bio: "I build high-performance web experiences and fluid digital interfaces for forward-thinking startups and global brands.",
    verified: true,
    skills: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "React Server Components",
      "Framer Motion",
      "UI/UX Architecture",
    ],
  },

  contact: {
    phone: "+213550123456",
    whatsapp: "213550123456",
    email: "amine@devcraft.io",
    website: "https://devcraft.io",
  },

  social: {
    github: "https://github.com/amine-dev",
    linkedin: "https://linkedin.com/in/amine-dev",
    x: "https://x.com/amine_codes",
    instagram: "https://instagram.com/amine.codes",
    telegram: "https://t.me/amine_dev",
  },

  location: {
    address: "Didouche Mourad St",
    city: "Algiers",
    country: "Algeria",
    googleMapsUrl: "https://maps.google.com/?q=Algiers+Algeria",
  },

  services: [
    {
      title: "Full-Stack Web Engineering",
      description:
        "Modern web applications built with Next.js App Router, SSR, and clean architectural patterns.",
      icon: "code",
      price: "From $2,500",
    },
    {
      title: "Design System Architecture",
      description:
        "Scalable component libraries with tokenized Tailwind CSS, full accessibility, and Framer Motion micro-interactions.",
      icon: "palette",
      price: "From $1,800",
    },
    {
      title: "Web Performance & SEO Audit",
      description:
        "Deep Core Web Vitals optimization, bundle shrinking, and crawlability improvements.",
      icon: "zap",
      price: "From $950",
    },
  ],

  projects: [
    {
      title: "FinPulse Analytics Hub",
      description:
        "Real-time institutional liquidity dashboard handling 10k+ events/sec with zero latency.",
      category: "Fintech Platform",
      image: "/images/project-1.svg",
      url: "https://devcraft.io/projects/finpulse",
      featured: true,
    },
    {
      title: "Verdant Design System",
      description:
        "Open-source enterprise component kit with strict WCAG 2.1 AA compliance.",
      category: "Design System",
      image: "/images/project-2.svg",
      url: "https://devcraft.io/projects/verdant",
    },
    {
      title: "Lumina Studio Experience",
      description:
        "Immersive 3D portfolio and interactive product showcase for architectural lighting.",
      category: "Creative Development",
      image: "/images/project-3.svg",
      url: "https://devcraft.io/projects/lumina",
    },
  ],

  products: [
    {
      name: "Next.js NFC Profile Kit",
      title: "Next.js NFC Profile Kit",
      description:
        "Production-ready, data-driven digital business card system with vCard support.",
      price: "$49",
      badge: "Best Seller",
      url: "https://devcraft.io/products/nfc-kit",
    },
  ],

  testimonials: [
    {
      quote:
        "Amine delivered our flagship platform two weeks ahead of schedule. The UX is buttery smooth and our conversion rate jumped by 34%.",
      text: "Amine delivered our flagship platform two weeks ahead of schedule. The UX is buttery smooth and our conversion rate jumped by 34%.",
      author: "Karim Mansouri",
      name: "Karim Mansouri",
      role: "VP of Product",
      company: "Atlas Ventures",
      rating: 5,
    },
  ],

  links: [
    {
      title: "Read My Engineering Essays",
      description: "Deep dives on React 19, Server Actions, and micro-interactions",
      url: "https://devcraft.io/blog",
      icon: "book-open",
      highlight: false,
    },
    {
      title: "Download Full Resume / CV",
      description: "Updated March 2026 • PDF format (2.1 MB)",
      url: "https://devcraft.io/cv.pdf",
      icon: "file-text",
      highlight: true,
    },
  ],

  booking: {
    enabled: true,
    url: "https://cal.com/amine",
    title: "Book a 30-Min Tech Consultation",
    description:
      "Let's explore your product requirements, tech stack, and timeline.",
  },

  extra: {
    cvUrl: "https://devcraft.io/cv.pdf",
    portfolioUrl: "https://devcraft.io",
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
    showPhone: true,
    showWhatsapp: true,
    showEmail: true,
    showWebsite: true,
  },

  theme: {
    mode: "dark",
    primaryColor: "#38bdf8",
    secondaryColor: "#818cf8",
    backgroundColor: "#0b0f19",
    surfaceColor: "#111827",
    textColor: "#f8fafc",
    mutedColor: "#94a3b8",
    borderRadius: "large",
  },
};

// Backward-compatibility export
export const personDemoProfile = amineProfile;
