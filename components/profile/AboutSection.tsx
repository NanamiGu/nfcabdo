import React from "react";
import { User, Sparkles, Target, Compass } from "lucide-react";
import { Profile } from "@/types/profile";

interface AboutSectionProps {
  profile: Profile;
}

export function AboutSection({ profile }: AboutSectionProps) {
  const { profile: info, type, settings } = profile;
  if (!settings.showAbout) return null;

  const isCompany = type === "company";
  const hasSkills = Boolean(info.skills && info.skills.length > 0);
  const hasMission = Boolean(info.mission && info.mission.trim());
  const hasContent = Boolean(info.bio || hasSkills || hasMission);

  if (!hasContent) return null;

  return (
    <section aria-labelledby="about-section-heading" className="w-full">
      <div className="p-5 sm:p-6 rounded-(--profile-radius) bg-(--profile-surface) border border-(--profile-border) shadow-sm space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-(--profile-border)">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-(--profile-primary)/10 text-(--profile-primary)">
            {isCompany ? <Target className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </div>
          <h2
            id="about-section-heading"
            className="text-base sm:text-lg font-bold tracking-tight text-(--profile-text)"
          >
            {isCompany ? "About Agency" : "About Me"}
          </h2>
        </div>

        {/* Bio / Description */}
        {info.bio && (
          <p className="text-sm leading-relaxed text-(--profile-text)/85">
            {info.bio}
          </p>
        )}

        {/* Company Mission statement */}
        {isCompany && hasMission && (
          <div className="p-3.5 rounded-xl bg-(--profile-primary)/5 border border-(--profile-primary)/15">
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold uppercase tracking-wider text-(--profile-primary)">
              <Compass className="w-3.5 h-3.5" />
              <span>Our Mission</span>
            </div>
            <p className="text-xs sm:text-sm italic text-(--profile-text)/90">
              &ldquo;{info.mission}&rdquo;
            </p>
          </div>
        )}

        {/* Skills / Tech Tags (Person) */}
        {!isCompany && hasSkills && (
          <div className="pt-2 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-(--profile-muted) uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-(--profile-primary)" />
              <span>Core Expertise</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {info.skills!.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-(--profile-bg) text-(--profile-text) border border-(--profile-border)"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
