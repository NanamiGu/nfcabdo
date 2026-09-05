"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Building2 } from "lucide-react";
import { Profile } from "@/types/profile";
import { getInitials } from "@/lib/utils";

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { profile: info, type } = profile;
  const isCompany = type === "company";
  const imageSrc = isCompany ? info.logo : (info.avatar || info.logo);
  const [imageError, setImageError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const hasCover = Boolean(info.coverImage && !coverError);

  return (
    <header className="relative w-full rounded-(--profile-radius) overflow-hidden bg-(--profile-surface) border border-(--profile-border) shadow-xl">
      {/* Optional Cover Banner */}
      {hasCover ? (
        <div className="relative w-full h-36 sm:h-44 overflow-hidden bg-black/40">
          <Image
            src={info.coverImage!}
            alt={`${info.name} cover`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-cover object-center transition-opacity duration-300"
            onError={() => setCoverError(true)}
          />
          <div className="absolute inset-0 bg-linear-to-t from-(--profile-surface) via-transparent to-black/20" />
        </div>
      ) : (
        <div className="w-full h-12 bg-linear-to-r from-(--profile-primary)/10 via-(--profile-secondary)/10 to-transparent" />
      )}

      {/* Main Profile Info */}
      <div className={`px-5 pb-6 text-center ${hasCover ? "-mt-14" : "-mt-2"}`}>
        {/* Avatar / Logo */}
        <div className="relative inline-block mx-auto mb-3.5">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 bg-(--profile-surface) border-2 border-(--profile-border) shadow-lg">
            {imageSrc && !imageError ? (
              <div className="relative w-full h-full rounded-full overflow-hidden bg-(--profile-surface)">
                <Image
                  src={imageSrc}
                  alt={info.name}
                  fill
                  priority
                  sizes="112px"
                  className="object-cover object-center"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="w-full h-full rounded-full flex items-center justify-center bg-linear-to-br from-(--profile-primary)/20 to-(--profile-secondary)/20 text-(--profile-primary) font-bold text-2xl tracking-wider">
                {getInitials(info.name)}
              </div>
            )}
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
            <span className="sr-only">({isCompany ? "Company Profile" : "Personal Profile"})</span>
          </div>

          {info.title && (
            <p className="text-sm sm:text-base font-semibold text-(--profile-primary) tracking-wide">
              {info.title}
            </p>
          )}

          {info.subtitle && (
            <p className="text-xs sm:text-sm text-(--profile-muted) font-medium">
              {info.subtitle}
            </p>
          )}
        </div>

        {/* Short Bio */}
        {info.bio && (
          <p className="mt-3.5 text-sm sm:text-[15px] leading-relaxed text-(--profile-text)/90 max-w-md mx-auto font-normal">
            {info.bio}
          </p>
        )}

        {/* Meta badges: e.g. Founded year for company */}
        {isCompany && info.founded && (
          <div className="mt-3 flex items-center justify-center gap-1 text-xs text-(--profile-muted)">
            <Building2 className="w-3.5 h-3.5 opacity-70" />
            <span>Established {info.founded}</span>
          </div>
        )}
      </div>
    </header>
  );
}
