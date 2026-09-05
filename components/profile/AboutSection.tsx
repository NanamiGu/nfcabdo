import React from "react";
import { User, Sparkles, Target, Compass, Eye, Tag } from "lucide-react";
import { Profile } from "@/types/profile";

interface AboutSectionProps {
  profile: Profile;
}

export function AboutSection({ profile }: AboutSectionProps) {
  const { profile: info, type, settings, skillsList } = profile;
  if (!settings.showAbout) return null;

  const isCompany = type === "company";
  const showSkills = settings.showSkills !== false;

  // Aggregate skills from both legacy string[] and new SkillItem[]
  const rawSkills: Array<{ name: string; level?: string }> = [];
  if (skillsList && skillsList.length > 0) {
    skillsList
      .filter((s) => s.visible !== false)
      .forEach((s) => rawSkills.push({ name: s.name, level: s.level }));
  } else if (info.skills && info.skills.length > 0) {
    info.skills.forEach((s) => rawSkills.push({ name: s }));
  }

  const hasSkills = showSkills && rawSkills.length > 0;
  const hasMission = Boolean(info.mission && info.mission.trim());
  const hasVision = Boolean(info.vision && info.vision.trim());
  const hasSpecialties = Boolean(info.specialties && info.specialties.length > 0);
  const hasHeadline = Boolean(info.headline && info.headline.trim());

  const hasContent = Boolean(
    info.bio ||
      info.shortDescription ||
      hasSkills ||
      hasMission ||
      hasVision ||
      hasSpecialties ||
      hasHeadline
  );

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
            {isCompany ? "About Company" : "About Me"}
          </h2>
        </div>

        {/* Headline or Short Description */}
        {(info.headline || info.shortDescription) && (
          <p className="text-sm font-semibold text-(--profile-primary) leading-relaxed">
            {info.headline || info.shortDescription}
          </p>
        )}

        {/* Bio / Description */}
        {info.bio && (
          <p className="text-sm leading-relaxed text-(--profile-text)/85 whitespace-pre-line">
            {info.bio}
          </p>
        )}

        {/* Company Mission statement */}
        {isCompany && hasMission && (
          <div className="p-3.5 rounded-xl bg-(--profile-primary)/5 border border-(--profile-primary)/15 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-(--profile-primary)">
              <Compass className="w-3.5 h-3.5" />
              <span>Our Mission</span>
            </div>
            <p className="text-xs sm:text-sm italic text-(--profile-text)/90">
              &ldquo;{info.mission}&rdquo;
            </p>
          </div>
        )}

        {/* Company Vision statement */}
        {isCompany && hasVision && (
          <div className="p-3.5 rounded-xl bg-(--profile-secondary)/5 border border-(--profile-secondary)/15 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-(--profile-secondary)">
              <Eye className="w-3.5 h-3.5" />
              <span>Our Vision</span>
            </div>
            <p className="text-xs sm:text-sm italic text-(--profile-text)/90">
              &ldquo;{info.vision}&rdquo;
            </p>
          </div>
        )}

        {/* Company Specialties */}
        {isCompany && hasSpecialties && (
          <div className="pt-1 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-(--profile-muted) uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5 text-(--profile-primary)" />
              <span>Specialties & Industry Focus</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {info.specialties!.map((specialty) => (
                <span
                  key={specialty}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-(--profile-bg) text-(--profile-text) border border-(--profile-border)"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills / Tech Tags (Person) */}
        {!isCompany && hasSkills && (
          <div className="pt-2 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-(--profile-muted) uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-(--profile-primary)" />
              <span>Skills & Expertise</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {rawSkills.map((skill, idx) => (
                <span
                  key={`${skill.name}-${idx}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-(--profile-bg) text-(--profile-text) border border-(--profile-border)"
                >
                  <span>{skill.name}</span>
                  {skill.level && (
                    <span className="text-[10px] text-(--profile-muted)">
                      ({skill.level})
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
