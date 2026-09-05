import React from "react";
import { Link2, ArrowUpRight } from "lucide-react";
import { ProfileLink } from "@/types/profile";
import { DynamicIcon } from "./DynamicIcon";
import { sanitizeUrl } from "@/lib/urls";

interface LinksSectionProps {
  links?: ProfileLink[];
  showLinks?: boolean;
}

export function LinksSection({ links, showLinks = true }: LinksSectionProps) {
  if (!showLinks || !links || links.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="custom-links-heading" className="w-full space-y-3.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-(--profile-primary)" />
          <h2
            id="custom-links-heading"
            className="text-sm font-bold tracking-wider uppercase text-(--profile-muted)"
          >
            Featured Resources & Links
          </h2>
        </div>
      </div>

      <div className="space-y-2.5">
        {links.map((link, idx) => {
          const href = sanitizeUrl(link.url);
          const isHighlight = Boolean(link.highlight);

          return (
            <a
              key={`${link.title}-${idx}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-4 rounded-(--profile-radius) flex items-center justify-between gap-3.5 transition-all duration-150 active:scale-[0.98] group ${
                isHighlight
                  ? "bg-linear-to-r from-(--profile-surface) to-(--profile-primary)/10 border-2 border-(--profile-primary)/50 shadow-md"
                  : "bg-(--profile-surface) hover:bg-(--profile-surface-hover) border border-(--profile-border)"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isHighlight
                      ? "bg-(--profile-primary) text-black"
                      : "bg-(--profile-primary)/10 text-(--profile-primary)"
                  }`}
                >
                  <DynamicIcon name={link.icon || "externallink"} className="w-4 h-4" />
                </div>

                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-(--profile-text) block group-hover:text-(--profile-primary) transition-colors">
                    {link.title}
                  </span>
                  {link.description && (
                    <span className="text-xs text-(--profile-muted) block">
                      {link.description}
                    </span>
                  )}
                </div>
              </div>

              <ArrowUpRight className="w-4 h-4 text-(--profile-muted) group-hover:text-(--profile-primary) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
