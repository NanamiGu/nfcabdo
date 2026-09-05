


import React from "react";
import { Profile } from "@/types/profile";
import { FooterActions } from "./FooterActions";

interface FooterProps {
  profile: Profile;
}

/**
 * Footer (Server Component)
 */
export function Footer({ profile }: FooterProps) {
  return (
    <footer className="w-full pt-8 pb-12 text-center space-y-4">
      {/* Action Row: Share + Scroll to Top (Client interactive controls) */}
      <FooterActions
        name={profile.profile.name}
        bio={profile.profile.bio}
      />

      {/* Branding */}
      <div className="space-y-1">
        <p className="text-[11px] text-(--profile-muted) opacity-70">
          © {new Date().getFullYear()} {profile.profile.name}. All rights reserved.
        </p>
        <p className="text-[10px] tracking-widest uppercase font-semibold text-(--profile-muted) opacity-50">
          NFC Digital Card System
        </p>
      </div>
    </footer>
  );
}
