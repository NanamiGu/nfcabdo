-- ==============================================================================
-- NFCABDO SEED DATA
-- Default profiles: Amine (Personal), ARTEX (Company), Minimal (Personal)
-- ==============================================================================

-- 1. ARTEX Creative Agency
INSERT INTO public.profiles (id, slug, type, status, profile_data)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'artex',
    'company',
    'active',
    '{
      "type": "company",
      "id": "prof_artex_01",
      "slug": "artex",
      "status": "active",
      "language": "en",
      "createdAt": "2026-01-10T14:00:00Z",
      "profile": {
        "name": "ARTEX Creative Agency",
        "username": "artex",
        "logo": "/images/artex-logo.svg",
        "coverImage": "/images/artex-cover.svg",
        "title": "Global Creative & Digital Agency",
        "subtitle": "Branding • Web Architecture • Immersive Experiences",
        "bio": "We craft iconic visual identities, bespoke web platforms, and digital brand experiences that drive exponential business value.",
        "verified": true,
        "founded": "2021",
        "mission": "To bridge strategic brand thinking with hyper-refined engineering."
      },
      "contact": {
        "phone": "+213555001122",
        "whatsapp": "213555001122",
        "email": "contact@artex-agency.com",
        "website": "https://artex-agency.com"
      },
      "social": {
        "instagram": "https://instagram.com/artex.agency",
        "linkedin": "https://linkedin.com/company/artex-agency",
        "x": "https://x.com/artex_agency",
        "facebook": "https://facebook.com/artexagency",
        "youtube": "https://youtube.com/@artexagency"
      },
      "location": {
        "address": "42 Boulevard des Martyrs",
        "city": "Algiers",
        "country": "Algeria",
        "googleMapsUrl": "https://maps.google.com/?q=Algiers+Boulevard+des+Martyrs"
      },
      "services": [
        {
          "title": "Brand Identity & Strategy",
          "description": "Comprehensive corporate identity systems, brand guidelines, typography, and distinctive positioning.",
          "icon": "palette",
          "price": "From $4,000"
        },
        {
          "title": "Digital Product Design",
          "description": "End-to-end UX wireframing, high-fidelity prototypes, and comprehensive design systems.",
          "icon": "layers",
          "price": "From $3,500"
        },
        {
          "title": "CGI & Motion Direction",
          "description": "3D product rendering, brand launch films, and interactive micro-animations that captivate.",
          "icon": "film",
          "price": "From $2,800"
        }
      ],
      "projects": [
        {
          "title": "Aura Luxury Fragrances",
          "description": "E-commerce flagship platform with custom WebGL 3D perfume customizer.",
          "image": "/images/project-1.svg",
          "category": "Brand & Web Experience",
          "url": "https://artex-agency.com/work/aura",
          "featured": true
        },
        {
          "title": "Novum FinTech Platform",
          "description": "Comprehensive design system and design token pipeline for a next-generation payments app.",
          "image": "/images/project-2.svg",
          "category": "Product Design",
          "url": "https://artex-agency.com/work/novum",
          "featured": true
        }
      ],
      "products": [
        {
          "title": "Brand System Blueprint v2.0",
          "description": "Production-tested Figma design system kit with 400+ auto-layout components and tokens.",
          "price": "$149",
          "image": "/images/product-1.svg",
          "url": "https://artex-agency.com/products/blueprint",
          "badge": "Bestseller"
        }
      ],
      "testimonials": [
        {
          "author": "Sophia Laurent",
          "role": "VP of Marketing",
          "company": "Solstice Group",
          "quote": "ARTEX elevated our visual identity beyond what we thought possible. Their execution speed and design precision are world-class.",
          "rating": 5
        }
      ],
      "links": [
        {
          "title": "Agency Showreel 2026",
          "url": "https://artex-agency.com/showreel",
          "description": "Watch our latest 4K reel highlighting award-winning client work",
          "icon": "play",
          "highlight": true
        }
      ],
      "booking": {
        "enabled": true,
        "url": "https://cal.com/artex-agency",
        "title": "Book a Discovery Call",
        "description": "Schedule a 30-minute strategic exploration with our partners."
      },
      "extra": {
        "catalogUrl": "https://artex-agency.com/catalog.pdf",
        "portfolioUrl": "https://artex-agency.com/portfolio"
      },
      "settings": {
        "showAbout": true,
        "showServices": true,
        "showProjects": true,
        "showProducts": true,
        "showTestimonials": true,
        "showLocation": true,
        "showSocial": true,
        "showBooking": true,
        "showLinks": true,
        "showSaveContact": true,
        "showPhone": true,
        "showWhatsapp": true,
        "showEmail": true,
        "showWebsite": true
      },
      "theme": {
        "mode": "dark",
        "primaryColor": "#f59e0b",
        "secondaryColor": "#d97706",
        "backgroundColor": "#0c0a09",
        "surfaceColor": "#1c1917",
        "textColor": "#fafaf9",
        "mutedColor": "#a8a29e",
        "borderRadius": "large"
      }
    }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    profile_data = EXCLUDED.profile_data,
    status = EXCLUDED.status,
    updated_at = now();

-- 2. Amine Belkacem (Personal Profile)
INSERT INTO public.profiles (id, slug, type, status, profile_data)
VALUES (
    'a0000000-0000-0000-0000-000000000002',
    'amine',
    'person',
    'active',
    '{
      "type": "person",
      "id": "prof_amine_01",
      "slug": "amine",
      "status": "active",
      "language": "en",
      "createdAt": "2026-01-15T10:00:00Z",
      "profile": {
        "name": "Amine Belkacem",
        "username": "amine",
        "avatar": "/images/amine-avatar.svg",
        "title": "Senior Frontend Developer",
        "subtitle": "React • Next.js • Design Systems",
        "bio": "I build high-performance web experiences and fluid digital interfaces for forward-thinking startups and global brands.",
        "verified": true,
        "skills": [
          "Next.js 15",
          "TypeScript",
          "Tailwind CSS",
          "React Server Components",
          "Framer Motion",
          "UI/UX Architecture"
        ]
      },
      "contact": {
        "phone": "+213550123456",
        "whatsapp": "213550123456",
        "email": "amine@devcraft.io",
        "website": "https://devcraft.io"
      },
      "social": {
        "github": "https://github.com/amine-dev",
        "linkedin": "https://linkedin.com/in/amine-dev",
        "x": "https://x.com/amine_codes",
        "instagram": "https://instagram.com/amine.codes",
        "telegram": "https://t.me/amine_dev"
      },
      "location": {
        "address": "Didouche Mourad St",
        "city": "Algiers",
        "country": "Algeria",
        "googleMapsUrl": "https://maps.google.com/?q=Algiers+Algeria"
      },
      "services": [
        {
          "title": "Full-Stack Web Engineering",
          "description": "Modern web applications built with Next.js App Router, SSR, and clean architectural patterns.",
          "icon": "code",
          "price": "From $2,500"
        },
        {
          "title": "Design System Architecture",
          "description": "Scalable tokenized UI systems, Tailwind config engines, and fluid component libraries.",
          "icon": "layout",
          "price": "From $1,800"
        }
      ],
      "projects": [
        {
          "title": "Veloce Design System",
          "description": "Accessible, high-performance React component library with automated token documentation.",
          "image": "/images/project-1.svg",
          "category": "Design Systems",
          "url": "https://devcraft.io/projects/veloce",
          "featured": true
        }
      ],
      "testimonials": [
        {
          "author": "Tariq Mansouri",
          "role": "CTO",
          "company": "Krypton Labs",
          "quote": "Amine transformed our frontend architecture. Page loads dropped below 400ms and our Lighthouse score reached a perfect 100.",
          "rating": 5
        }
      ],
      "booking": {
        "enabled": true,
        "url": "https://cal.com/amine",
        "title": "Book a 30-Min Tech Consultation",
        "description": "Let us explore your product requirements, tech stack, and timeline."
      },
      "settings": {
        "showAbout": true,
        "showServices": true,
        "showProjects": true,
        "showProducts": false,
        "showTestimonials": true,
        "showLocation": true,
        "showSocial": true,
        "showBooking": true,
        "showLinks": false,
        "showSaveContact": true,
        "showPhone": true,
        "showWhatsapp": true,
        "showEmail": true,
        "showWebsite": true
      },
      "theme": {
        "mode": "dark",
        "primaryColor": "#38bdf8",
        "secondaryColor": "#0284c7",
        "backgroundColor": "#090d16",
        "surfaceColor": "#0f172a",
        "textColor": "#f8fafc",
        "mutedColor": "#94a3b8",
        "borderRadius": "medium"
      }
    }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    profile_data = EXCLUDED.profile_data,
    status = EXCLUDED.status,
    updated_at = now();

-- 3. Sara Nour (Minimal Profile)
INSERT INTO public.profiles (id, slug, type, status, profile_data)
VALUES (
    'a0000000-0000-0000-0000-000000000003',
    'minimal',
    'person',
    'active',
    '{
      "type": "person",
      "id": "prof_minimal_01",
      "slug": "minimal",
      "status": "active",
      "language": "en",
      "profile": {
        "name": "Sara Nour",
        "username": "minimal",
        "title": "Architect",
        "bio": "Crafting sustainable living spaces with clean architectural rhythm."
      },
      "contact": {
        "phone": "+213555998877",
        "email": "sara@nour-arch.dz"
      },
      "social": {
        "instagram": "https://instagram.com/saranour"
      },
      "settings": {
        "showAbout": true,
        "showServices": false,
        "showProjects": false,
        "showProducts": false,
        "showTestimonials": false,
        "showLocation": false,
        "showSocial": true,
        "showBooking": false,
        "showLinks": false,
        "showSaveContact": true,
        "showPhone": true,
        "showWhatsapp": false,
        "showEmail": false,
        "showWebsite": false
      },
      "theme": {
        "mode": "dark",
        "primaryColor": "#10b981",
        "secondaryColor": "#059669",
        "backgroundColor": "#06130d",
        "surfaceColor": "#0b2017",
        "textColor": "#ecfdf5",
        "mutedColor": "#6ee7b7",
        "borderRadius": "medium"
      }
    }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    profile_data = EXCLUDED.profile_data,
    status = EXCLUDED.status,
    updated_at = now();
