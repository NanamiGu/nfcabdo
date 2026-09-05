"use client";

import React, { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { Profile } from "@/types/profile";
import { getBorderRadiusValue, hasAnySocial } from "@/lib/utils";
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

interface ProfilePageProps {
  profile: Profile;
}

// Subtle Framer Motion Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

export function ProfilePage({ profile }: ProfilePageProps) {
  const { theme, settings } = profile;

  // Build dynamic CSS custom properties from the profile's theme configuration
  const themeStyles = useMemo(() => {
    const isDark = theme.mode === "dark";
    const primary = theme.primaryColor || (isDark ? "#38bdf8" : "#0284c7");
    const secondary = theme.secondaryColor || (isDark ? "#818cf8" : "#4f46e5");
    const bg = theme.backgroundColor || (isDark ? "#09090b" : "#f8fafc");
    const surface =
      theme.surfaceColor || (isDark ? "#141417" : "#ffffff");
    const text = theme.textColor || (isDark ? "#f4f4f5" : "#09090b");
    const muted = theme.mutedColor || (isDark ? "#a1a1aa" : "#64748b");
    const border = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";
    const surfaceHover = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)";
    const radius = getBorderRadiusValue(theme.borderRadius);

    return {
      "--profile-primary": primary,
      "--profile-secondary": secondary,
      "--profile-bg": bg,
      "--profile-surface": surface,
      "--profile-surface-hover": surfaceHover,
      "--profile-text": text,
      "--profile-muted": muted,
      "--profile-border": border,
      "--profile-radius": radius,
    } as React.CSSProperties;
  }, [theme]);

  const shouldRenderSocial =
    settings.showSocial && hasAnySocial(profile.social);

  return (
    <div
      style={themeStyles}
      className="min-h-dvh w-full bg-(--profile-bg) text-(--profile-text) flex justify-center selection:bg-(--profile-primary) selection:text-black antialiased overflow-x-hidden"
    >
      {/* Background ambient lighting glow */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25 dark:opacity-20 transition-opacity"
        style={{
          background: `radial-gradient(circle 400px at 50% 100px, var(--profile-primary), transparent 75%)`,
        }}
      />

      {/* Main card column - strictly bounded for card feel */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-lg px-3.5 sm:px-5 py-4 sm:py-8 flex flex-col gap-4 sm:gap-5"
      >
        {/* 1. Header (Who is this / What do they do?) */}
        <motion.div variants={itemVariants}>
          <ProfileHeader profile={profile} />
        </motion.div>

        {/* 2. Primary Contact Quick Actions (How can I contact them?) */}
        <motion.div variants={itemVariants}>
          <ContactActions
            contact={profile.contact}
            location={profile.location}
          />
        </motion.div>

        {/* 3. High-Conversion Save Contact vCard */}
        {settings.showSaveContact && (
          <motion.div variants={itemVariants}>
            <SaveContactButton profile={profile} />
          </motion.div>
        )}

        {/* 4. Social Media Links */}
        {shouldRenderSocial && (
          <motion.div variants={itemVariants}>
            <SocialLinks social={profile.social} />
          </motion.div>
        )}

        {/* 5. About Section */}
        {settings.showAbout && (
          <motion.div variants={itemVariants}>
            <AboutSection profile={profile} />
          </motion.div>
        )}

        {/* 6. Services & Capabilities */}
        {settings.showServices && (
          <motion.div variants={itemVariants}>
            <ServicesSection
              services={profile.services}
              showServices={settings.showServices}
            />
          </motion.div>
        )}

        {/* 7. Featured Projects / Portfolio */}
        {settings.showProjects && (
          <motion.div variants={itemVariants}>
            <ProjectsSection
              projects={profile.projects}
              showProjects={settings.showProjects}
            />
          </motion.div>
        )}

        {/* 8. Products & Store Items */}
        {settings.showProducts && (
          <motion.div variants={itemVariants}>
            <ProductsSection
              products={profile.products}
              showProducts={settings.showProducts}
            />
          </motion.div>
        )}

        {/* 9. Client Endorsements / Testimonials */}
        {settings.showTestimonials && (
          <motion.div variants={itemVariants}>
            <TestimonialsSection
              testimonials={profile.testimonials}
              showTestimonials={settings.showTestimonials}
            />
          </motion.div>
        )}

        {/* 10. Featured Links & Resources */}
        {settings.showLinks && (
          <motion.div variants={itemVariants}>
            <LinksSection
              links={profile.links}
              showLinks={settings.showLinks}
            />
          </motion.div>
        )}

        {/* 11. Location & Navigation */}
        {settings.showLocation && (
          <motion.div variants={itemVariants}>
            <LocationSection
              location={profile.location}
              showLocation={settings.showLocation}
            />
          </motion.div>
        )}

        {/* 12. Online Booking CTA */}
        {settings.showBooking && (
          <motion.div variants={itemVariants}>
            <BookingSection
              booking={profile.booking}
              showBooking={settings.showBooking}
            />
          </motion.div>
        )}

        {/* 13. Footer */}
        <motion.div variants={itemVariants}>
          <Footer profile={profile} />
        </motion.div>
      </motion.main>
    </div>
  );
}
