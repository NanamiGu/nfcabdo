"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProjectImageProps {
  image?: string;
  title: string;
  category?: string;
}

export function ProjectImage({ image, title, category }: ProjectImageProps) {
  const [error, setError] = useState(false);

  if (!image || error) {
    if (!category) return null;
    return (
      <div className="pt-4 px-4">
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-(--profile-primary)/10 text-(--profile-primary) border border-(--profile-primary)/20">
          {category}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-black/40">
      <Image
        src={image}
        alt={title}
        fill
        loading="lazy"
        sizes="(max-width: 768px) 100vw, 600px"
        className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
        onError={() => setError(true)}
      />
      {category && (
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-black/70 backdrop-blur-md text-white border border-white/10">
            {category}
          </span>
        </div>
      )}
    </div>
  );
}
