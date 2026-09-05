"use client";

import React, { useState } from "react";
import { Share2, Check, ArrowUp } from "lucide-react";
import { Profile } from "@/types/profile";

interface FooterProps {
  profile: Profile;
}

export function Footer({ profile }: FooterProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const url = window.location.href;
    const title = `${profile.profile.name} — Digital Profile`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: profile.profile.bio || `Check out ${profile.profile.name}'s digital business card`,
          url,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full pt-8 pb-12 text-center space-y-4">
      {/* Action Row: Share + Scroll to Top */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share this digital card"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-(--profile-surface) hover:bg-(--profile-surface-hover) border border-(--profile-border) text-(--profile-muted) hover:text-(--profile-text) transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Profile</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top of card"
          className="w-8 h-8 rounded-full flex items-center justify-center bg-(--profile-surface) hover:bg-(--profile-surface-hover) border border-(--profile-border) text-(--profile-muted) hover:text-(--profile-text) transition-all active:scale-95"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

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
