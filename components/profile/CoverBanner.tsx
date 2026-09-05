"use client";

import React, { useState } from "react";
import Image from "next/image";

interface CoverBannerProps {
  coverImage?: string;
  name: string;
}

export function CoverBanner({ coverImage, name }: CoverBannerProps) {
  const [error, setError] = useState(false);

  if (coverImage && !error) {
    return (
      <div className="relative w-full h-36 sm:h-44 overflow-hidden bg-black/40">
        <Image
          src={coverImage}
          alt={`${name} cover`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 640px"
          className="object-cover object-center transition-opacity duration-300"
          onError={() => setError(true)}
        />
        <div className="absolute inset-0 bg-linear-to-t from-(--profile-surface) via-transparent to-black/20" />
      </div>
    );
  }

  return (
    <div className="w-full h-12 bg-linear-to-r from-(--profile-primary)/10 via-(--profile-secondary)/10 to-transparent" />
  );
}
