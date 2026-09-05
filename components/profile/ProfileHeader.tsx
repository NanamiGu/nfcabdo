import React from "react";
import { CheckCircle2, Building2, MapPin, Briefcase } from "lucide-react";
import { Profile } from "@/types/profile";
import { ProfileAvatar } from "./ProfileAvatar";
import { CoverBanner } from "./CoverBanner";

interface ProfileHeaderProps {
  profile: Profile;
}

/**
 * ProfileHeader (Server Component)
 * Renders the top profile identity card on the server for instant mobile loading.
 */
export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { profile: info, type, location } = profile;
  const isCompany = type === "company";
  const imageSrc = isCompany ? info.logo : (info.avatar || info.logo);
  const hasCover = Boolean(info.coverImage);

  // Sub-headline logic
  const headline = info.headline || info.tagline;
  const locationDisplay = [location?.city, location?.country].filter(Boolean).join(", ");

  return (
    <header className="relative w-full rounded-(--profile-radius) overflow-hidden bg-(--profile-surface) border border-(--profile-border) shadow-xl">
      {/* Optional Cover Banner */}
      <CoverBanner coverImage={info.coverImage} name={info.name} />

      {/* Main Profile Info */}
      <div className={`px-5 pb-6 text-center ${hasCover ? "-mt-14" : "pt-6"}`}>
        {/* Avatar / Logo */}
        <div className="relative inline-block mx-auto mb-3.5">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 bg-(--profile-surface) border-2 border-(--profile-border) shadow-lg">
            <ProfileAvatar imageSrc={imageSrc} name={info.name} />
          </div>

          {/* Verified Badge */}
          {info.verified && (
            <div
              className="absolute bottom-1 right-1 bg-(--profile-surface) rounded-full p-0.5 shadow-md"
              title="Verified Profile"
            >
              <CheckCircle2
                className="w-5 h-5 text-(--profile-primary) fill-(--profile-primary)/20"
                aria-label="Verified"
              />
            </div>
          )}
        </div>

        {/* Identity & Headings */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-(--profile-text)">
              {info.name}
            </h1>
            {info.pronouns && (
              <span className="text-xs text-(--profile-muted) font-normal">
                ({info.pronouns})
              </span>
            )}
            <span className="sr-only">
              ({isCompany ? "Company Profile" : "Personal Profile"})
            </span>
          </div>

          {/* Title or Company Tagline */}
          {info.title && (
            <p className="text-sm sm:text-base font-semibold text-(--profile-primary) tracking-wide">
              {info.title}
              {!isCompany && info.company && (
                <span className="text-(--profile-muted) font-normal">
                  {" "}at <span className="font-semibold text-(--profile-text)">{info.company}</span>
                </span>
              )}
            </p>
          )}

          {/* Headline / Tagline */}
          {headline && headline !== info.title && (
            <p className="text-xs sm:text-sm text-(--profile-muted) font-medium max-w-sm mx-auto">
              {headline}
            </p>
          )}

          {/* Location badge or Industry badge */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {locationDisplay && (
              <span className="inline-flex items-center gap-1 text-xs text-(--profile-muted)">
                <MapPin className="w-3 h-3 opacity-70" />
                <span>{locationDisplay}</span>
              </span>
            )}

            {isCompany && info.industry && (
              <span className="inline-flex items-center gap-1 text-xs text-(--profile-muted)">
                <Briefcase className="w-3 h-3 opacity-70" />
                <span>{info.industry}</span>
              </span>
            )}

            {isCompany && info.founded && (
              <span className="inline-flex items-center gap-1 text-xs text-(--profile-muted)">
                <Building2 className="w-3 h-3 opacity-70" />
                <span>Est. {info.founded}</span>
              </span>
            )}
          </div>
        </div>

        {/* Short Bio */}
        {info.bio && (
          <p className="mt-3.5 text-sm sm:text-[15px] leading-relaxed text-(--profile-text)/90 max-w-md mx-auto font-normal">
            {info.bio}
          </p>
        )}
      </div>
    </header>
  );
}
