import { Profile, ProfileType, ProfileStatus } from "@/types/profile";

export const THEME_COLOR_PRESETS = [
  { name: "Obsidian", primary: "#0f172a", secondary: "#334155", bg: "#ffffff", surface: "#f8fafc", text: "#0f172a", muted: "#64748b" },
  { name: "Royal Indigo", primary: "#4f46e5", secondary: "#6366f1", bg: "#090d16", surface: "#111827", text: "#f9fafb", muted: "#9ca3af" },
  { name: "Emerald Pro", primary: "#059669", secondary: "#10b981", bg: "#06130e", surface: "#0b1f17", text: "#f0fdf4", muted: "#86efac" },
  { name: "Electric Azure", primary: "#0284c7", secondary: "#38bdf8", bg: "#040d1a", surface: "#0a1829", text: "#f0f9ff", muted: "#7dd3fc" },
  { name: "Sunset Crimson", primary: "#e11d48", secondary: "#f43f5e", bg: "#140408", surface: "#210910", text: "#fff1f2", muted: "#fda4af" },
  { name: "Warm Amber", primary: "#d97706", secondary: "#f59e0b", bg: "#160d03", surface: "#241708", text: "#fffbeb", muted: "#fcd34d" },
  { name: "Minimal Light", primary: "#18181b", secondary: "#52525b", bg: "#fafafa", surface: "#ffffff", text: "#18181b", muted: "#71717a" },
  { name: "Pure Dark", primary: "#38bdf8", secondary: "#818cf8", bg: "#09090b", surface: "#18181b", text: "#fafafa", muted: "#a1a1aa" },
];

export const SOCIAL_PLATFORMS = [
  { id: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  { id: "x", label: "X (Twitter)", placeholder: "https://x.com/username" },
  { id: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
  { id: "github", label: "GitHub", placeholder: "https://github.com/username" },
  { id: "youtube", label: "YouTube", placeholder: "https://youtube.com/@channel" },
  { id: "telegram", label: "Telegram", placeholder: "https://t.me/username" },
  { id: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@username" },
  { id: "facebook", label: "Facebook", placeholder: "https://facebook.com/username" },
] as const;

export function getDefaultProfile(type: ProfileType = "person"): Profile {
  const isCompany = type === "company";

  const defaultTheme = {
    mode: "dark" as const,
    primaryColor: "#38bdf8",
    secondaryColor: "#818cf8",
    backgroundColor: "#09090b",
    surfaceColor: "#18181b",
    textColor: "#fafafa",
    mutedColor: "#a1a1aa",
    borderRadius: "large" as const,
  };

  const defaultSettings = {
    showIdentity: true,
    showAbout: true,
    showContact: true,
    showServices: true,
    showProjects: !isCompany,
    showProducts: isCompany,
    showTestimonials: true,
    showLocation: true,
    showSocial: true,
    showBooking: true,
    showLinks: true,
    showSaveContact: true,
    showExperience: !isCompany,
    showEducation: !isCompany,
    showSkills: true,
    showResources: true,
    showWebsite: true,
    showEmail: true,
    showPhone: true,
    showWhatsapp: true,
  };

  const base = {
    slug: "",
    status: "active" as ProfileStatus,
    profile: {
      name: isCompany ? "Acme Innovations Inc." : "Alex Carter",
      title: isCompany ? "Enterprise AI & Cloud Solutions" : "Senior Software Architect",
      headline: isCompany
        ? "Transforming enterprise operations with modern technology"
        : "Building scalable cloud systems & distributed platforms",
      bio: isCompany
        ? "We partner with forward-thinking organizations to build high-performance digital platforms, streamline cloud infrastructure, and unlock business agility."
        : "10+ years engineering cloud-native platforms, high-throughput microservices, and modern web applications. Passionate about developer ergonomics and system resilience.",
      tagline: isCompany ? "Engineering the Future of Work" : undefined,
      company: !isCompany ? "Apex Cloud" : undefined,
      industry: isCompany ? "Enterprise Software / SaaS" : undefined,
      founded: isCompany ? "2021" : undefined,
      mission: isCompany ? "To empower teams worldwide with seamless, automated software systems." : undefined,
      vision: isCompany ? "A connected enterprise ecosystem that operates in real-time without friction." : undefined,
      specialties: isCompany ? ["Cloud Architecture", "Distributed Systems", "AI Workflows", "Cybersecurity"] : undefined,
      skills: !isCompany ? ["TypeScript", "Next.js", "Go", "AWS Cloud", "Kubernetes", "PostgreSQL", "System Design"] : undefined,
      verified: true,
    },
    contact: {
      phone: "+1 (555) 234-5678",
      whatsapp: "+15552345678",
      email: isCompany ? "contact@acmeinnovations.com" : "alex.carter@example.com",
      website: isCompany ? "https://acmeinnovations.com" : "https://alexcarter.dev",
    },
    social: {
      linkedin: "https://linkedin.com",
      x: "https://x.com",
      github: !isCompany ? "https://github.com" : undefined,
      instagram: "https://instagram.com",
    },
    location: {
      city: "San Francisco",
      country: "United States",
      address: "500 Howard Street, Suite 400",
      googleMapsUrl: "https://maps.google.com",
    },
    services: [
      {
        id: "srv-1",
        title: isCompany ? "Cloud Transformation & Migration" : "Technical Advisory & Architecture",
        description: isCompany
          ? "End-to-end cloud adoption strategy, containerization, and automated CI/CD pipelines."
          : "Strategic architecture design, code audits, and modernization for high-growth tech teams.",
        price: "Custom",
        deliveryTime: "2-4 Weeks",
        features: ["Architecture review & roadmap", "Security posture assessment", "Dedicated engineer pairing"],
        ctaText: "Inquire Now",
        icon: "cloud",
        visible: true,
      },
      {
        id: "srv-2",
        title: isCompany ? "Enterprise Systems Engineering" : "Full-Stack System Engineering",
        description: isCompany
          ? "Custom software, microservices architectures, and integrations tailored to enterprise scale."
          : "High-throughput APIs, Next.js web applications, and mission-critical cloud integrations.",
        price: "$4,500+",
        deliveryTime: "Flexible",
        features: ["Production-ready Next.js / Node.js", "Strict zero-downtime deployments"],
        ctaText: "Book Consultation",
        icon: "code",
        visible: true,
      },
    ],
    projects: !isCompany
      ? [
          {
            id: "proj-1",
            title: "Distributed Edge Payment Gateway",
            description: "Low-latency global payment router processing 15M+ transactions/day with sub-50ms p99.",
            status: "Production",
            technologies: ["Next.js", "Go", "PostgreSQL", "Redis", "Kafka"],
            url: "https://github.com",
            visible: true,
          },
        ]
      : [],
    products: isCompany
      ? [
          {
            id: "prod-1",
            title: "Enterprise Cloud Audit Suite",
            description: "Automated vulnerability and compliance scanning for multi-cloud Kubernetes clusters.",
            price: "$299/mo",
            badge: "Popular",
            buyUrl: "https://acmeinnovations.com/suite",
            inStock: true,
            visible: true,
          },
        ]
      : [],
    testimonials: [
      {
        id: "test-1",
        name: "Sarah Jenkins",
        role: "VP of Engineering",
        company: "Starlight Global",
        content: isCompany
          ? "Acme delivered an incredible platform overhaul that cut our deployment times by 70%. Outstanding team!"
          : "Alex solved in two weeks an architectural bottleneck our internal team struggled with for months. Truly top tier.",
        rating: 5,
        visible: true,
      },
    ],
    links: [
      {
        id: "link-1",
        title: isCompany ? "Company Whitepaper & Tech Specs" : "Read My Technical Blog",
        description: isCompany ? "Download our 2026 Cloud Resilience Report" : "Deep-dives into distributed systems & Next.js",
        url: "https://google.com",
        highlight: true,
        icon: "bookopen",
        visible: true,
      },
    ],
    resources: [
      {
        id: "res-1",
        title: isCompany ? "Corporate Capabilities Deck (PDF)" : "Engineering Resume & CV (PDF)",
        description: "Official 2026 credentials and project overview.",
        fileUrl: "https://example.com/resume.pdf",
        fileType: "pdf",
        fileSize: "1.8 MB",
        visible: true,
      },
    ],
    experience: !isCompany
      ? [
          {
            id: "exp-1",
            title: "Principal Cloud Architect",
            company: "Apex Cloud Solutions",
            employmentType: "Full-time",
            location: "San Francisco, CA (Hybrid)",
            startDate: "2022",
            endDate: "Present",
            current: true,
            description: "Leading architectural direction for enterprise multi-region Kubernetes deployments and edge data platforms.",
            visible: true,
          },
          {
            id: "exp-2",
            title: "Senior Software Engineer",
            company: "Vanguard Tech Labs",
            employmentType: "Full-time",
            location: "Austin, TX",
            startDate: "2019",
            endDate: "2022",
            current: false,
            description: "Designed event-driven real-time streaming services processing billions of daily events.",
            visible: true,
          },
        ]
      : undefined,
    education: !isCompany
      ? [
          {
            id: "edu-1",
            school: "University of California, Berkeley",
            degree: "B.S. in Computer Science",
            fieldOfStudy: "Distributed Systems & Machine Learning",
            startDate: "2015",
            endDate: "2019",
            description: "Graduated with Honors. Co-authored research on low-latency consensus protocols.",
            visible: true,
          },
        ]
      : undefined,
    skillsList: [
      { id: "sk-1", name: "System Architecture", level: "Expert", visible: true },
      { id: "sk-2", name: "Next.js / React", level: "Expert", visible: true },
      { id: "sk-3", name: "TypeScript", level: "Expert", visible: true },
      { id: "sk-4", name: "Cloud Infrastructure (AWS/GCP)", level: "Advanced", visible: true },
      { id: "sk-5", name: "PostgreSQL & Redis", level: "Advanced", visible: true },
    ],
    booking: {
      enabled: true,
      title: "Schedule a 30-Min Discovery Call",
      description: "Pick a convenient time on my calendar to discuss your upcoming project or architecture needs.",
      url: "https://calendly.com",
      ctaText: "Book Meeting",
    },
    settings: defaultSettings,
    theme: defaultTheme,
  };

  if (isCompany) {
    return {
      type: "company",
      ...base,
    };
  }

  return {
    type: "person",
    ...base,
  };
}
