export type ProfileType = "person" | "company";

export interface Service {
  title: string;
  description: string;
  icon?: string;
  image?: string;
  price?: string;
}

export interface Project {
  title: string;
  description: string;
  image?: string;
  category?: string;
  url?: string;
  featured?: boolean;
}

export interface Product {
  title: string;
  description: string;
  price?: string;
  image?: string;
  url?: string;
  badge?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

export interface ProfileLink {
  title: string;
  url: string;
  description?: string;
  icon?: string;
  highlight?: boolean;
}

export interface ProfileInfo {
  name: string;
  username?: string;
  logo?: string;
  avatar?: string;
  coverImage?: string;
  title?: string;
  subtitle?: string;
  bio?: string;
  verified?: boolean;
  skills?: string[];
  founded?: string;
  mission?: string;
}

export interface ProfileContact {
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
}

export interface ProfileSocial {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
  x?: string;
  telegram?: string;
  github?: string;
}

export interface ProfileLocation {
  address?: string;
  city?: string;
  country?: string;
  googleMapsUrl?: string;
}

export interface ProfileBooking {
  enabled: boolean;
  url?: string;
  title?: string;
  description?: string;
}

export interface ProfileExtra {
  cvUrl?: string;
  catalogUrl?: string;
  menuUrl?: string;
  portfolioUrl?: string;
}

export interface ProfileSettings {
  showAbout: boolean;
  showServices: boolean;
  showProjects: boolean;
  showProducts: boolean;
  showTestimonials: boolean;
  showLocation: boolean;
  showSocial: boolean;
  showBooking: boolean;
  showLinks: boolean;
  showSaveContact: boolean;
}

export interface ProfileTheme {
  mode: "light" | "dark";
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor?: string;
  textColor?: string;
  mutedColor?: string;
  borderRadius: "small" | "medium" | "large";
}

export interface Profile {
  type: ProfileType;
  profile: ProfileInfo;
  contact: ProfileContact;
  social?: ProfileSocial;
  location?: ProfileLocation;
  services?: Service[];
  projects?: Project[];
  products?: Product[];
  testimonials?: Testimonial[];
  links?: ProfileLink[];
  booking?: ProfileBooking;
  extra?: ProfileExtra;
  settings: ProfileSettings;
  theme: ProfileTheme;
}
