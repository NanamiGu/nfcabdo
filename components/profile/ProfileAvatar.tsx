"use client";

import React, { useState } from "react";
import Image from "next/image";
import { getInitials } from "@/lib/utils";

interface ProfileAvatarProps {
  imageSrc?: string;
  name: string;
}

export function ProfileAvatar({ imageSrc, name }: ProfileAvatarProps) {
  const [error, setError] = useState(false);

  if (imageSrc && !error) {
    return (
      <div className="relative w-full h-full rounded-full overflow-hidden bg-(--profile-surface)">
        <Image
          src={imageSrc}
          alt={name}
          fill
          priority
          sizes="112px"
          className="object-cover object-center"
          onError={() => setError(true)}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-full flex items-center justify-center bg-linear-to-br from-(--profile-primary)/20 to-(--profile-secondary)/20 text-(--profile-primary) font-bold text-2xl tracking-wider select-none">
      {getInitials(name)}
    </div>
  );
}
