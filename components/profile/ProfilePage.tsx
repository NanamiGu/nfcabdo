import React from "react";
import { Profile } from "@/types/profile";
import { hasAnySocial } from "@/lib/utils";
import { getThemeStyles } from "@/lib/theme";
import { ProfileHeader } from "./ProfileHeader";
import { ContactActions } from "./ContactActions";
import { SaveContactButton } from "./SaveContactButton";
import { SocialLinks } from "./SocialLinks";
import { AboutSection } from "./AboutSection";
import { ServicesSection } from "./ServicesSection";
import { ProjectsSection } from "./ProjectsSection";
import { ProductsSection } from "./ProductsSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { LinksSection } from "./LinksSection";
import { LocationSection } from "./LocationSection";
import { BookingSection } from "./BookingSection";
import { Footer } from "./Footer";
import { MotionSection } from "./MotionSection";

interface ProfilePageProps {
  profile: Profile;
}

/**
 * ProfilePage (Server Component)
 * =============================================================
 * Renders the entire profile tree on the server for instant NFC
 * load times, zero layout shifts, and minimal client JavaScript.
 *
 * Micro-interactions (vCard download, social share, subtle motion)
 * are cleanly isolated into lightweight client boundaries.
 * =============================================================
 */
export function ProfilePage({ profile }: ProfilePageProps) {
  const { theme, settings } = profile;
  const themeStyles = getThemeStyles(theme);

  // Strict conditional evaluation: ensure both settings flag AND real data exist
  const shouldRenderSocial =
    settings.showSocial && hasAnySocial(profile.social);

  const hasAboutData = Boolean(
    profile.profile.bio ||
      profile.profile.mission ||
      (profile.profile.skills && profile.profile.skills.length > 0)
  );
  const shouldRenderAbout = settings.showAbout && hasAboutData;

  const shouldRenderServices =
    settings.showServices &&
    Boolean(profile.services && profile.services.length > 0);

  const shouldRenderProjects =
    settings.showProjects &&
    Boolean(profile.projects && profile.projects.length > 0);

  const shouldRenderProducts =
    settings.showProducts &&
    Boolean(profile.products && profile.products.length > 0);

  const shouldRenderTestimonials =
    settings.showTestimonials &&
    Boolean(profile.testimonials && profile.testimonials.length > 0);

  const shouldRenderLinks =
    settings.showLinks && Boolean(profile.links && profile.links.length > 0);

  const hasLocationData = Boolean(
    profile.location?.address ||
      profile.location?.city ||
      profile.location?.country ||
      profile.location?.googleMapsUrl
  );
  const shouldRenderLocation = settings.showLocation && hasLocationData;

  const shouldRenderBooking =
    settings.showBooking &&
    Boolean(profile.booking?.enabled && profile.booking?.url?.trim());

  const shouldRenderSaveContact = settings.showSaveContact !== false;

  return (
    <div
      style={themeStyles}
      className="min-h-dvh w-full bg-(--profile-bg) text-(--profile-text) flex justify-center selection:bg-(--profile-primary) selection:text-black antialiased overflow-x-hidden"
    >
      {/* Background ambient radial glow */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25 dark:opacity-20 transition-opacity"
        style={{
          background: `radial-gradient(circle 400px at 50% 100px, var(--profile-primary), transparent 75%)`,
        }}
      />

      {/* Main card column - strictly bounded for card feel */}
      <main className="relative z-10 w-full max-w-lg px-3.5 sm:px-5 py-4 sm:py-8 flex flex-col gap-4 sm:gap-5">
        {/* 1. Header (Who is this / What do they do?) */}
        <MotionSection delay={0.02}>
          <ProfileHeader profile={profile} />
        </MotionSection>

        {/* 2. Primary Contact Quick Actions */}
        <MotionSection delay={0.06}>
          <ContactActions
            contact={profile.contact}
            location={profile.location}
            settings={settings}
          />
        </MotionSection>

        {/* 3. High-Conversion Save Contact vCard */}
        {shouldRenderSaveContact && (
          <MotionSection delay={0.1}>
            <SaveContactButton profile={profile} />
          </MotionSection>
        )}

        {/* 4. Social Media Links */}
        {shouldRenderSocial && (
          <MotionSection delay={0.14}>
            <SocialLinks social={profile.social} />
          </MotionSection>
        )}

        {/* 5. About Section */}
        {shouldRenderAbout && (
          <MotionSection delay={0.18}>
            <AboutSection profile={profile} />
          </MotionSection>
        )}

        {/* 6. Services & Capabilities */}
        {shouldRenderServices && (
          <MotionSection delay={0.22}>
            <ServicesSection
              services={profile.services}
              showServices={settings.showServices}
            />
          </MotionSection>
        )}

        {/* 7. Featured Projects / Portfolio */}
        {shouldRenderProjects && (
          <MotionSection delay={0.26}>
            <ProjectsSection
              projects={profile.projects}
              showProjects={settings.showProjects}
            />
          </MotionSection>
        )}

        {/* 8. Products & Store Items */}
        {shouldRenderProducts && (
          <MotionSection delay={0.3}>
            <ProductsSection
              products={profile.products}
              showProducts={settings.showProducts}
            />
          </MotionSection>
        )}

        {/* 9. Client Endorsements / Testimonials */}
        {shouldRenderTestimonials && (
          <MotionSection delay={0.34}>
            <TestimonialsSection
              testimonials={profile.testimonials}
              showTestimonials={settings.showTestimonials}
            />
          </MotionSection>
        )}

        {/* 10. Featured Links & Resources */}
        {shouldRenderLinks && (
          <MotionSection delay={0.38}>
            <LinksSection
              links={profile.links}
              showLinks={settings.showLinks}
            />
          </MotionSection>
        )}

        {/* 11. Location & Navigation */}
        {shouldRenderLocation && (
          <MotionSection delay={0.42}>
            <LocationSection
              location={profile.location}
              showLocation={settings.showLocation}
            />
          </MotionSection>
        )}

        {/* 12. Online Booking CTA */}
        {shouldRenderBooking && (
          <MotionSection delay={0.46}>
            <BookingSection
              booking={profile.booking}
              showBooking={settings.showBooking}
            />
          </MotionSection>
        )}

        {/* 13. Footer */}
        <MotionSection delay={0.5}>
          <Footer profile={profile} />
        </MotionSection>
      </main>
    </div>
  );
}
