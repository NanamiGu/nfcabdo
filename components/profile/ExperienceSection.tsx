import React from "react";
import { Briefcase, Building2, MapPin, Calendar, ExternalLink } from "lucide-react";
import { Experience } from "@/types/profile";
import { sanitizeUrl } from "@/lib/urls";

interface ExperienceSectionProps {
  experience?: Experience[];
  showExperience?: boolean;
}

export function ExperienceSection({
  experience,
  showExperience = true,
}: ExperienceSectionProps) {
  if (!showExperience || !experience || experience.length === 0) {
    return null;
  }

  // Filter individual visibility
  const visibleItems = experience.filter((item) => item.visible !== false);
  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="experience-heading" className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-(--profile-primary)" />
          <h2
            id="experience-heading"
            className="text-sm font-bold tracking-wider uppercase text-(--profile-muted)"
          >
            Experience
          </h2>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-(--profile-surface) text-(--profile-muted) border border-(--profile-border)">
          {visibleItems.length}
        </span>
      </div>

      <div className="space-y-3">
        {visibleItems.map((item) => {
          const dateRange = [
            item.startDate,
            item.current ? "Present" : item.endDate,
          ]
            .filter(Boolean)
            .join(" — ");

          return (
            <div
              key={item.id || `${item.title}-${item.company}`}
              className="p-4 sm:p-5 rounded-(--profile-radius) bg-(--profile-surface) border border-(--profile-border) shadow-sm space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex shrink-0 items-center justify-center bg-(--profile-primary)/10 text-(--profile-primary) border border-(--profile-border) overflow-hidden mt-0.5">
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt={item.company}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-(--profile-text) leading-snug">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-xs text-(--profile-muted)">
                      <span className="font-semibold text-(--profile-text)/90">
                        {item.company}
                      </span>
                      {item.employmentType && (
                        <>
                          <span>•</span>
                          <span>{item.employmentType}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {item.url && (
                  <a
                    href={sanitizeUrl(item.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-1.5 rounded-lg text-(--profile-muted) hover:text-(--profile-text) hover:bg-(--profile-bg) transition-colors"
                    aria-label={`Visit ${item.company} website`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Meta information: Dates and Location */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-(--profile-muted) pl-12">
                {dateRange && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 opacity-70" />
                    <span>{dateRange}</span>
                  </div>
                )}
                {item.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 opacity-70" />
                    <span>{item.location}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-xs sm:text-sm leading-relaxed text-(--profile-muted) pl-12">
                  {item.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
