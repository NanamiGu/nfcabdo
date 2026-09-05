export type ProfileType = "person" | "company";

export type ProfileStatus = "active" | "inactive" | "draft";

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
  name?: string;
  title?: string;
  description: string;
  price?: string;
  image?: string;
  url?: string;
  badge?: string;
}

export interface Testimonial {
  name?: string;
  author?: string;
  role?: string;
  company?: string;
  avatar?: string;
  text?: string;
  quote?: string;
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

export interface ContactInfo {
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
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
}

// Alias for backward compatibility
export type ProfileBooking = Booking;

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
