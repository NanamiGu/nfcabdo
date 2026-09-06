"use client";

import React from "react";
import { Theme } from "@/types/profile";
import { THEME_COLOR_PRESETS } from "./types";
import { Sun, Moon, Check } from "lucide-react";

interface ThemeSelectorProps {
  theme: Theme;
  onChange: (newTheme: Theme) => void;
}

export function ThemeSelector({ theme, onChange }: ThemeSelectorProps) {
  const handlePresetSelect = (preset: (typeof THEME_COLOR_PRESETS)[number]) => {
    onChange({
      ...theme,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      backgroundColor: preset.bg,
      surfaceColor: preset.surface,
      textColor: preset.text,
      mutedColor: preset.muted,
      mode: preset.bg === "#ffffff" || preset.bg === "#fafafa" ? "light" : "dark",
    });
  };

  return (
    <div className="space-y-6">
      {/* Light / Dark Mode Toggle */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          Color Scheme Mode
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              onChange({
                ...theme,
                mode: "light",
                backgroundColor: "#ffffff",
                surfaceColor: "#f8fafc",
                textColor: "#0f172a",
                mutedColor: "#64748b",
              })
            }
            className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
              theme.mode === "light"
                ? "border-slate-900 bg-slate-50 text-slate-900 shadow-xs ring-1 ring-slate-900/10"
                : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light Mode</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onChange({
                ...theme,
                mode: "dark",
                backgroundColor: "#09090b",
                surfaceColor: "#18181b",
                textColor: "#fafafa",
                mutedColor: "#a1a1aa",
              })
            }
            className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
              theme.mode === "dark"
                ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>Dark Mode</span>
          </button>
        </div>
      </div>

      {/* Preset Palettes */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          Curated Color Palettes
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {THEME_COLOR_PRESETS.map((preset) => {
            const isSelected =
              theme.primaryColor.toLowerCase() === preset.primary.toLowerCase() &&
              theme.backgroundColor.toLowerCase() === preset.bg.toLowerCase();

            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900/15"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {preset.name}
                  </span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs shrink-0"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs shrink-0"
                    style={{ backgroundColor: preset.bg }}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs shrink-0"
                    style={{ backgroundColor: preset.surface }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Overrides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">
            Primary Accent
          </label>
          <div className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 bg-slate-50">
            <input
              type="color"
              value={theme.primaryColor}
              onChange={(e) =>
                onChange({ ...theme, primaryColor: e.target.value })
              }
              className="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent"
            />
            <input
              type="text"
              value={theme.primaryColor}
              onChange={(e) =>
                onChange({ ...theme, primaryColor: e.target.value })
              }
              className="w-full text-xs font-mono uppercase bg-transparent text-slate-800 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">
            Background
          </label>
          <div className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 bg-slate-50">
            <input
              type="color"
              value={theme.backgroundColor}
              onChange={(e) =>
                onChange({ ...theme, backgroundColor: e.target.value })
              }
              className="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent"
            />
            <input
              type="text"
              value={theme.backgroundColor}
              onChange={(e) =>
                onChange({ ...theme, backgroundColor: e.target.value })
              }
              className="w-full text-xs font-mono uppercase bg-transparent text-slate-800 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">
            Surface Cards
          </label>
          <div className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 bg-slate-50">
            <input
              type="color"
              value={theme.surfaceColor || "#18181b"}
              onChange={(e) =>
                onChange({ ...theme, surfaceColor: e.target.value })
              }
              className="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent"
            />
            <input
              type="text"
              value={theme.surfaceColor || "#18181b"}
              onChange={(e) =>
                onChange({ ...theme, surfaceColor: e.target.value })
              }
              className="w-full text-xs font-mono uppercase bg-transparent text-slate-800 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Border Radius Choice */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          Corner Softness (Radius)
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(["small", "medium", "large"] as const).map((rad) => (
            <button
              key={rad}
              type="button"
              onClick={() => onChange({ ...theme, borderRadius: rad })}
              className={`p-2.5 text-xs font-semibold capitalize rounded-xl border transition-all cursor-pointer ${
                theme.borderRadius === rad
                  ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                  : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
              }`}
            >
              {rad}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
