import React from "react";
import { Briefcase, Clock, Check, ArrowRight } from "lucide-react";
import { Service } from "@/types/profile";
import { DynamicIcon } from "./DynamicIcon";
import { sanitizeUrl } from "@/lib/urls";

interface ServicesSectionProps {
  services?: Service[];
  showServices?: boolean;
}

export function ServicesSection({
  services,
  showServices = true,
}: ServicesSectionProps) {
  if (!showServices || !services || services.length === 0) {
    return null;
  }

  // Filter individual item visibility
  const visibleServices = services.filter((s) => s.visible !== false);
  if (visibleServices.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="services-heading" className="w-full space-y-3.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-(--profile-primary)" />
          <h2
            id="services-heading"
            className="text-sm font-bold tracking-wider uppercase text-(--profile-muted)"
          >
            Services & Expertise
          </h2>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-(--profile-surface) text-(--profile-muted) border border-(--profile-border)">
          {visibleServices.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-1">
        {visibleServices.map((service, index) => {
          const ctaUrl = service.ctaUrl ? sanitizeUrl(service.ctaUrl) : "";

          return (
            <div
              key={service.id || `${service.title}-${index}`}
              className="p-4 sm:p-5 rounded-(--profile-radius) bg-(--profile-surface) border border-(--profile-border) hover:border-(--profile-primary)/40 transition-all duration-200 shadow-sm space-y-3 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-(--profile-primary)/10 text-(--profile-primary) group-hover:scale-105 transition-transform shrink-0">
                    <DynamicIcon name={service.icon} className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-(--profile-text)">
                      {service.title}
                    </h3>
                    {service.deliveryTime && (
                      <div className="flex items-center gap-1 text-[11px] text-(--profile-muted) mt-0.5">
                        <Clock className="w-3 h-3 opacity-70" />
                        <span>{service.deliveryTime}</span>
                      </div>
                    )}
                  </div>
                </div>

                {service.price && (
                  <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-(--profile-primary)/10 text-(--profile-primary) border border-(--profile-primary)/20">
                    {service.price}
                  </span>
                )}
              </div>

              {service.description && (
                <p className="text-xs sm:text-sm leading-relaxed text-(--profile-muted)">
                  {service.description}
                </p>
              )}

              {/* Service Features checklist if provided */}
              {service.features && service.features.length > 0 && (
                <ul className="space-y-1 pt-1 border-t border-(--profile-border)/60">
                  {service.features.map((feat, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-center gap-2 text-xs text-(--profile-text)/85"
                    >
                      <Check className="w-3 h-3 text-(--profile-primary) shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Action CTA if provided */}
              {ctaUrl && (
                <div className="pt-1 flex justify-end">
                  <a
                    href={ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-(--profile-primary)/10 hover:bg-(--profile-primary)/20 text-(--profile-primary) border border-(--profile-primary)/25 transition-all"
                  >
                    <span>{service.ctaText || "Inquire"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
