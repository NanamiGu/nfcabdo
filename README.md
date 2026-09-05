# NFC Digital Profile System 📇✨

A production-grade, data-driven **NFC Digital Business Card & Digital Profile Platform** built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

This platform delivers an ultra-fast, premium mobile-first landing experience triggered instantly when an NFC card or QR code is tapped or scanned.

---

## 🚀 Key Highlights & Architecture

- **100% Data-Driven Architecture**: The entire UI is completely decoupled from client data. Create, update, or rebrand any client profile simply by editing a configuration object in `data/client.ts`.
- **Zero Component Modifications Required**: Never touch or rewrite JSX components for new clients.
- **Dual Profile Paradigms**:
  1. **Personal Profile**: Optimized for developers, designers, creators, freelancers, consultants, and executives (avatar, profession, skills, vCard, GitHub, portfolio).
  2. **Company Profile**: Optimized for agencies, studios, restaurants, salons, retail, and enterprises (brand logo, cover banner, industry, mission, services, case studies, map directions).
- **Zero Empty Section Slop**: Strict conditional rendering guarantees that if an item, link, or section is empty or disabled in `settings`, it will never render an empty card or awkward whitespace.
- **Dynamic vCard Generator (`.vcf`)**: Instant mobile download of standard vCard 3.0 contacts compatible with iOS Contacts and Android Contacts.
- **Theme Engine via CSS Custom Properties**: Seamless dark/light and custom palette injection from `profile.theme` (`--profile-primary`, `--profile-secondary`, `--profile-bg`, `--profile-surface`, etc.).
- **Dynamic SEO & Open Graph Metadata**: Server-side metadata generated per profile for rich iMessage, WhatsApp, Twitter, and LinkedIn previews.
- **Fluid & Accessible**: Fully accessible touch targets (≥44px), semantic HTML, screen reader labels, keyboard navigation, and `prefers-reduced-motion` compliance.

---

## 📁 Project Structure

```text
nfcabdo/
├── app/
│   ├── layout.tsx                # Root layout with Geist font & Viewport config
│   ├── globals.css               # Theme engine & CSS custom properties
│   ├── page.tsx                  # Root route: renders active client + showcase bar
│   ├── p/[username]/page.tsx     # Dynamic route for Personal profiles (/p/amine)
│   └── c/[slug]/page.tsx         # Dynamic route for Company profiles (/c/artex)
│
├── components/
│   ├── DemoBar.tsx               # Top floating showcase switcher
│   └── profile/
│       ├── ProfilePage.tsx       # Master profile orchestrator with theme injection
│       ├── ProfileHeader.tsx     # Avatar/Logo, cover, verified badge, bio, title
│       ├── ContactActions.tsx    # WhatsApp (wa.me), Phone (tel:), Email, Website
│       ├── SaveContactButton.tsx # Client-side vCard (.vcf) generator & downloader
│       ├── SocialLinks.tsx       # Instagram, LinkedIn, X, GitHub, YouTube, TikTok...
│       ├── AboutSection.tsx      # Bio, skills tags (person) or mission quote (company)
│       ├── ServicesSection.tsx   # Grid of service offerings with icons & pricing
│       ├── ProjectsSection.tsx   # Portfolio case studies with image fallbacks
│       ├── ProductsSection.tsx   # Digital/physical products, store items, badges
│       ├── TestimonialsSection.tsx # Verified client endorsements & star ratings
│       ├── LinksSection.tsx      # Featured resource links & download triggers
│       ├── LocationSection.tsx   # Address, city, country, Google Maps navigation
│       ├── BookingSection.tsx    # Cal.com / Calendly scheduling CTA card
│       ├── DynamicIcon.tsx       # Safe Lucide icon resolver with fallbacks
│       └── Footer.tsx            # Copyright, share profile sheet, scroll to top
│
├── data/
│   ├── client.ts                 # Active client config & database query mock
│   └── demo/
│       ├── person.ts             # Full Personal profile demo (Amine Belkacem)
│       └── company.ts            # Full Company profile demo (ARTEX Agency)
│
├── types/
│   └── profile.ts                # TypeScript definitions & data contracts
│
├── lib/
│   ├── vcard.ts                  # vCard 3.0 string builder & browser downloader
│   ├── urls.ts                   # Sanitized WhatsApp, tel, mailto, maps helpers
│   └── utils.ts                  # Initials extractor, validation, border-radius
│
└── public/
    └── images/                   # SVG mock assets (avatars, logos, projects, covers)
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🔄 Dynamic Routes & NFC URL Mapping

When programming physical NFC chips or QR codes, configure them to point to:

| Route | Example URL | Purpose |
| :--- | :--- | :--- |
| `/` | `https://yourdomain.com/` | Default active client configured in `data/client.ts` |
| `/p/[username]` | `https://yourdomain.com/p/amine` | Personal profile for username `amine` |
| `/c/[slug]` | `https://yourdomain.com/c/artex` | Company profile for agency slug `artex` |
| `/p/minimal` | `https://yourdomain.com/p/minimal` | Minimal test profile (name + phone + Instagram only) |

---

## ⚙️ How to Create a New Client

To onboard a new client, follow these steps:

### Step 1: Open `data/client.ts` (or create a file in `data/`)

```typescript
import { Profile } from "@/types/profile";

export const myNewClient: Profile = {
  type: "person", // or "company"
  profile: {
    name: "Karim Ziani",
    username: "karim",
    avatar: "/images/karim-avatar.jpg",
    title: "Brand Strategist & Creative Director",
    subtitle: "Brand Identity • UI Design • Creative Direction",
    bio: "Helping brands differentiate with memorable visual design and storytelling.",
    verified: true,
    skills: ["Brand Strategy", "Figma", "Art Direction", "Design Systems"]
  },
  contact: {
    phone: "+213550112233",
    whatsapp: "213550112233",
    email: "karim@studio.dz",
    website: "https://karimziani.design"
  },
  social: {
    instagram: "https://instagram.com/karim.design",
    linkedin: "https://linkedin.com/in/karim-design",
    x: "https://x.com/karim_z"
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
    showLinks: false,
    showSaveContact: true
  },
  theme: {
    mode: "dark",
    primaryColor: "#f59e0b",
    secondaryColor: "#d97706",
    backgroundColor: "#09090b",
    surfaceColor: "#141417",
    textColor: "#fafafa",
    mutedColor: "#a1a1aa",
    borderRadius: "large"
  }
};
```

### Step 2: Set as Active Client
In `data/client.ts`:
```typescript
export const client: Profile = myNewClient;
```

---

## 🎨 How to Customize Colors & Themes

Colors are controlled entirely from the `theme` object of each profile. CSS variables are computed automatically:

```typescript
theme: {
  mode: "dark",                // "light" | "dark"
  primaryColor: "#38bdf8",     // Main accent (buttons, icons, highlights)
  secondaryColor: "#818cf8",   // Secondary accent (gradients, badges)
  backgroundColor: "#0b0f19",  // Page background
  surfaceColor: "#111827",     // Card background
  textColor: "#f8fafc",        // Main text color
  mutedColor: "#94a3b8",       // Subtitles, metadata, secondary text
  borderRadius: "large"        // "small" (8px) | "medium" (14px) | "large" (20px)
}
```

### Example Palettes:
- **Luxury Gold Agency**: `primaryColor: "#f59e0b"`, `backgroundColor: "#09090b"`, `surfaceColor: "#141417"`
- **Cyber Sky Developer**: `primaryColor: "#38bdf8"`, `backgroundColor: "#0b0f19"`, `surfaceColor: "#111827"`
- **Emerald Eco Studio**: `primaryColor: "#10b981"`, `backgroundColor: "#06130d"`, `surfaceColor: "#0b2017"`
- **Clean Minimalist Light**: `mode: "light"`, `primaryColor: "#18181b"`, `backgroundColor: "#f4f4f5"`, `surfaceColor: "#ffffff"`

---

## 🖼️ How to Replace Images

1. Place images into the `public/images/` directory:
   - Personal Avatar: `public/images/your-avatar.jpg` (or `.png`, `.webp`, `.svg`)
   - Company Logo: `public/images/company-logo.svg`
   - Cover Banner: `public/images/company-cover.jpg`
   - Project Thumbs: `public/images/project-1.jpg`
2. Update the image paths in your client profile:
   ```typescript
   avatar: "/images/your-avatar.jpg"
   coverImage: "/images/company-cover.jpg"
   ```
3. **Graceful Fallbacks Built-in**: If an image fails to load or the path is omitted:
   - Avatars & Logos gracefully display the client's initials (e.g. `AB`) on an accented gradient.
   - Cover banners gracefully collapse with zero layout shift.
   - Project cards display the category tag and title without broken image icons.

---

## 👤 Personal Profile vs 🏢 Company Profile

| Feature | Personal Profile (`type: "person"`) | Company Profile (`type: "company"`) |
| :--- | :--- | :--- |
| **Primary Visual** | Circular Avatar with fallback initials | Brand Logo with optional Cover Banner |
| **Header Identity** | Name + Job Title + Subtitle | Company Name + Agency/Industry + Subtitle |
| **About Section** | Bio + Core Expertise Skills Tags | Bio + Established Year + Mission Quote |
| **Contact Priorities** | Direct Call, WhatsApp, Email, vCard | Office Location, WhatsApp, Sales Email, Web |
| **vCard Format** | Formatted as `N:LastName;FirstName` | Formatted as `ORG:CompanyName` |

---

## 📲 Save Contact / vCard (.vcf) Details

When the user taps **"Save Contact to Phone"**:
1. `downloadVCard(profile)` in `lib/vcard.ts` builds a compliant vCard 3.0 structure.
2. It includes:
   - Full Name
   - Title / Profession
   - Organization Name
   - Primary Phone & WhatsApp
   - Email Address
   - Website URL
   - Physical Address / City / Country
   - Short Bio in Notes
3. Automatically triggers an immediate download as `<name>.vcf`.
4. On iOS Safari and Android Chrome, opening a `.vcf` file immediately prompts the native Contacts app to "Save New Contact".

---

## 🛡️ Edge Cases & Verified Scenarios

The system has been verified across all mandatory test scenarios:

1. **Full Personal Profile**: Amine Belkacem (`/p/amine`) - all 13 sections populated.
2. **Full Company Profile**: ARTEX Creative Agency (`/c/artex`) - all 13 sections populated with cover image & mission.
3. **Minimal Profile**: Sara Nour (`/p/minimal`) - only Name, Phone, and Instagram. No empty cards or awkward spaces.
4. **No Projects**: Sections array is empty or `settings.showProjects: false` -> section omitted completely.
5. **No Services**: Sections array is empty or `settings.showServices: false` -> section omitted completely.
6. **No Social Media**: Social object is empty or `settings.showSocial: false` -> row omitted completely.
7. **No Location**: Location object omitted -> location card and "Directions" button omitted.
8. **All Optional Sections Disabled**: Displays a hyper-minimalist digital card with just header, contact actions, and footer.

---

## 🔮 Future Database & Multi-Tenant Roadmap

`data/client.ts` contains the asynchronous data adapter:

```typescript
export async function getProfileBySlug(
  slug: string,
  expectedType?: "person" | "company"
): Promise<Profile | null> { ... }
```

To connect Supabase, Prisma, PostgreSQL, or an external CMS:
1. Replace the mock dictionary lookup inside `getProfileBySlug` with your database query (e.g. `await prisma.profile.findUnique({ where: { slug } })`).
2. Keep the returned object conforming to the `Profile` interface in `types/profile.ts`.
3. **Result**: Your entire UI layer, dynamic routes, and page components remain 100% untouched.

---

## 📄 License
MIT. Built for high-conversion NFC digital cards and modern profile workflows.
