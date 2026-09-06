"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, Check, ArrowDownToLine } from "lucide-react";
import { Profile } from "@/types/profile";
import { downloadVCard } from "@/lib/vcard";

interface SaveContactButtonProps {
  profile: Profile;
}

export function SaveContactButton({ profile }: SaveContactButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(timer);
  }, [saved]);

  if (profile.settings.showSaveContact === false) {
    return null;
  }

  const handleSaveContact = () => {
    try {
      downloadVCard(profile);
      setSaved(true);
    } catch (err) {
      console.error("Failed to generate or download contact vCard:", err);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleSaveContact}
        aria-label={`Save ${profile.profile.name}'s contact card to phone contacts`}
        className="w-full h-12 sm:h-13 px-6 rounded-(--profile-radius) font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 bg-(--profile-primary) text-black dark:text-neutral-950 shadow-lg hover:opacity-95 active:scale-[0.98] transition-all duration-150 cursor-pointer"
        style={{
          boxShadow: "0 8px 24px -6px rgba(0,0,0,0.3)",
        }}
      >
        {saved ? (
          <>
            <Check className="w-5 h-5 animate-scale stroke-[2.5]" />
            <span>Card Downloaded to Contacts!</span>
          </>
        ) : (
          <>
            <UserPlus className="w-5 h-5 stroke-[2.2]" />
            <span>Save Contact to Phone</span>
            <ArrowDownToLine className="w-4 h-4 opacity-70 ml-0.5" />
          </>
        )}
      </button>
    </div>
  );
}
