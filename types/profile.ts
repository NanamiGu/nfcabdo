export type ProfileType = "person" | "company";

export type ProfileStatus = "active" | "inactive" | "draft";

export interface Service {
  id?: string;
  title: string;
  description: string;
  fullDescription?: string;
  icon?: string;
  image?: string;
  price?: string;
  currency?: string;
  priceLabel?: string;
  url?: string;
  ctaText?: string;
  ctaUrl?: string;
  deliveryTime?: string;
  features?: string[];
  featured?: boolean;
  visible?: boolean;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  fullDescription?: string;
  image?: string;
  images?: string[];
  category?: string;
  client?: string;
  date?: string;
  url?: string;
  caseStudyUrl?: string;
  githubUrl?: string;
  github?: string;
  status?: string;
  technologies?: string[];
  tags?: string[];
  featured?: boolean;
  visible?: boolean;
}

export interface Product {
  id?: string;
  name?: string;
  title?: string;
  description: string;
  price?: string;
  currency?: string;
  image?: string;
  url?: string;
  purchaseUrl?: string;
  buyUrl?: string;
  badge?: string;
  featured?: boolean;
  inStock?: boolean;
  availability?: "in_stock" | "preorder" | "sold_out" | string;
  visible?: boolean;
}

export interface Testimonial {
  id?: string;
  name?: string;
  author?: string;
  role?: string;
  company?: string;
  avatar?: string;
  text?: string;
  quote?: string;
  content?: string;
  rating?: number;
  url?: string;
  visible?: boolean;
}

export interface ProfileLink {
  id?: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  highlight?: boolean;
  visible?: boolean;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  logo?: string;
  employmentType?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  url?: string;
  visible?: boolean;
}

export interface Education {
  id: string;
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  url?: string;
  logo?: string;
  visible?: boolean;
}

export interface SkillItem {
  id: string;
  name: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "Expert" | string;
  visible?: boolean;
}

export interface ResourceItem {
  id: string;
  title: string;
  url?: string;
  fileUrl?: string;
  type?: "cv" | "portfolio" | "catalog" | "menu" | "brochure" | "other" | string;
  fileType?: string;
  fileSize?: string;
  description?: string;
  visible?: boolean;
}

export interface ProfileInfo {
  name: string;
  username?: string;
  headline?: string;
  tagline?: string;
  pronouns?: string;
  company?: string;
  logo?: string;
  avatar?: string;
  coverImage?: string;
  title?: string;
  subtitle?: string;
  bio?: string;
  shortDescription?: string;
  verified?: boolean;
  language?: string;
  skills?: string[];
  founded?: string;
  mission?: string;
  vision?: string;
  industry?: string;
  companyType?: string;
  companySize?: string;
  specialties?: string[];
}

export interface ContactInfo {
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  visibility?: {
    phone?: boolean;
    whatsapp?: boolean;
    email?: boolean;
    website?: boolean;
  };
}

// Alias for backward compatibility
export type ProfileContact = ContactInfo;

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
  x?: string;
  telegram?: string;
  github?: string;
  visibility?: {
    instagram?: boolean;
    facebook?: boolean;
    linkedin?: boolean;
    tiktok?: boolean;
    youtube?: boolean;
    x?: boolean;
    telegram?: boolean;
    github?: boolean;
    [key: string]: boolean | undefined;
  };
}

// Alias for backward compatibility
export type ProfileSocial = SocialLinks;

export interface Location {
  address?: string;
  city?: string;
  country?: string;
  googleMapsUrl?: string;
}

// Alias for backward compatibility
export type ProfileLocation = Location;

export interface Booking {
  enabled: boolean;
  url?: string;
  title?: string;
  description?: string;
  ctaText?: string;
}

// Alias for backward compatibility
export type ProfileBooking = Booking;

export interface ProfileExtra {
  cvUrl?: string;
  catalogUrl?: string;
  menuUrl?: string;
  portfolioUrl?: string;
  mediaKitUrl?: string;
  brochureUrl?: string;
  resources?: ResourceItem[];
}

export interface ProfileSettings {
  showIdentity?: boolean;
  showAbout: boolean;
  showContact?: boolean;
  showServices: boolean;
  showProjects: boolean;
  showProducts: boolean;
  showTestimonials: boolean;
  showLocation: boolean;
  showSocial: boolean;
  showBooking: boolean;
  showLinks: boolean;
  showSaveContact: boolean;
  showExperience?: boolean;
  showEducation?: boolean;
  showSkills?: boolean;
  showResources?: boolean;
  showWebsite?: boolean;
  showEmail?: boolean;
  showPhone?: boolean;
  showWhatsapp?: boolean;
}

export interface Theme {
  mode: "light" | "dark";
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor?: string;
  textColor?: string;
  mutedColor?: string;
  borderRadius: "small" | "medium" | "large";
}

// Alias for backward compatibility
export type ProfileTheme = Theme;

interface BaseProfile {
  id?: string;
  slug?: string;
  status?: ProfileStatus;
  language?: string;
  createdAt?: string;
  updatedAt?: string;
  profile: ProfileInfo;
  contact: ContactInfo;
  social?: SocialLinks;
  location?: Location;
  services?: Service[];
  projects?: Project[];
  products?: Product[];
  testimonials?: Testimonial[];
  links?: ProfileLink[];
  booking?: Booking;
  extra?: ProfileExtra;
  resources?: ResourceItem[];
  experience?: Experience[];
  education?: Education[];
  skillsList?: SkillItem[];
  settings: ProfileSettings;
  theme: Theme;
}

export interface PersonProfile extends BaseProfile {
  type: "person";
}

export interface CompanyProfile extends BaseProfile {
  type: "company";
}

export type Profile = PersonProfile | CompanyProfile;
