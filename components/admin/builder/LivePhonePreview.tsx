"use client";

import React, { useState } from "react";
import { Profile } from "@/types/profile";
import { ProfilePage } from "@/components/profile/ProfilePage";
import { Smartphone, RotateCcw } from "lucide-react";

interface LivePhonePreviewProps {
  profile: Profile;
}

export function LivePhonePreview({ profile }: LivePhonePreviewProps) {
  const currentTime = "9:41";

  const [previewKey, setPreviewKey] = useState(0);

  const handleRefresh = () => {
    setPreviewKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col items-center sticky top-6">
      {/* Phone header toolbar */}
      <div className="w-full max-w-97.5 mb-3 flex items-center justify-between px-2 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-slate-700" />
          <span className="font-semibold text-slate-800">Live Phone Preview</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            Realtime
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            title="Reload Preview Frame"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Realistic Smartphone Mockup Chassis */}
      <div className="relative w-85 sm:w-95 h-180 rounded-[48px] bg-slate-950 p-3 shadow-2xl ring-1 ring-slate-800/80 transition-all duration-300">
        {/* Outer Phone Bezel & Reflection Highlights */}
        <div className="absolute inset-0 rounded-[48px] pointer-events-none border border-slate-700/40 shadow-inner" />

        {/* Side Buttons (Physical simulation) */}
        <div className="absolute -left-1.5 top-24 w-1 h-8 bg-slate-700 rounded-l-sm" />
        <div className="absolute -left-1.5 top-36 w-1 h-12 bg-slate-700 rounded-l-sm" />
        <div className="absolute -left-1.5 top-52 w-1 h-12 bg-slate-700 rounded-l-sm" />
        <div className="absolute -right-1.5 top-32 w-1 h-16 bg-slate-700 rounded-r-sm" />

        {/* Screen Container with Dynamic Island / Speaker Notch */}
        <div className="relative w-full h-full rounded-[38px] bg-black overflow-hidden flex flex-col border border-slate-900">
          {/* Top Status Bar with Dynamic Island */}
          <div className="relative z-30 h-10 w-full bg-(--profile-bg,black) flex items-center justify-between px-6 pt-1 text-[11px] font-semibold text-white select-none shrink-0">
            {/* Time */}
            <span>{currentTime}</span>

            {/* Dynamic Island / Camera pill */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2 h-4 w-24 bg-black rounded-full flex items-center justify-end px-2 border border-white/10 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700/60" />
            </div>

            {/* Status Icons: Signal & Battery */}
            <div className="flex items-center gap-1.5 text-[10px]">
              <div className="flex items-end gap-0.5 h-2.5">
                <span className="w-0.5 h-1 bg-white rounded-xs" />
                <span className="w-0.5 h-1.5 bg-white rounded-xs" />
                <span className="w-0.5 h-2 bg-white rounded-xs" />
                <span className="w-0.5 h-2.5 bg-white rounded-xs" />
              </div>
              <div className="w-4 h-2 rounded-xs border border-white/80 p-0.5 flex items-center">
                <div className="w-full h-full bg-white rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Phone Scrollable Screen Content */}
          <div
            key={previewKey}
            className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none select-none text-left"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <ProfilePage profile={profile} />
          </div>

          {/* Home Bar indicator at the bottom */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full pointer-events-none z-30" />
        </div>
      </div>

      {/* Helper text below phone */}
      <p className="mt-3 text-center text-xs text-slate-400">
        Changes in the form reflect immediately in this preview.
      </p>
    </div>
  );
}
