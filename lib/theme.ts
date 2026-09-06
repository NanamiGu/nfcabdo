import type React from "react";
import type { Theme } from "@/types/profile";

export function getBorderRadiusValue(radius?: "small" | "medium" | "large"): string {
  switch (radius) {
    case "small":
      return "0.5rem"; // 8px
    case "medium":
      return "0.875rem"; // 14px
    case "large":
    default:
      return "1.25rem"; // 20px
  }
}

/**
 * Builds dynamic CSS custom properties from a profile's theme object.
 * Safe to run in Server Components or Client Components.
 */
export function getThemeStyles(theme?: Theme | null): React.CSSProperties {
  const isDark = theme?.mode === "dark";
  const primary = theme?.primaryColor || (isDark ? "#38bdf8" : "#0284c7");
  const secondary = theme?.secondaryColor || (isDark ? "#818cf8" : "#4f46e5");
  const bg = theme?.backgroundColor || (isDark ? "#09090b" : "#f8fafc");
  const surface = theme?.surfaceColor || (isDark ? "#141417" : "#ffffff");
  const text = theme?.textColor || (isDark ? "#f4f4f5" : "#09090b");
  const muted = theme?.mutedColor || (isDark ? "#a1a1aa" : "#64748b");
  const border = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";
  const surfaceHover = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)";
  const radius = getBorderRadiusValue(theme?.borderRadius);

  return {
    "--profile-primary": primary,
    "--profile-secondary": secondary,
    "--profile-bg": bg,
    "--profile-surface": surface,
    "--profile-surface-hover": surfaceHover,
    "--profile-text": text,
    "--profile-muted": muted,
    "--profile-border": border,
    "--profile-radius": radius,
  } as React.CSSProperties;
}
