import React from "react";
import { Briefcase } from "lucide-react";
import { Service } from "@/types/profile";
import { DynamicIcon } from "./DynamicIcon";

interface ServicesSectionProps {
  services?: Service[];
  showServices?: boolean;
}

export function ServicesSection({ services, showServices = true }: ServicesSectionProps) {
  if (!showServices || !services || services.length === 0) {
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
          {services.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-1">
        {services.map((service, index) => (
          <div
            key={`${service.title}-${index}`}
            className="p-4 sm:p-5 rounded-(--profile-radius) bg-(--profile-surface) border border-(--profile-border) hover:border-(--profile-primary)/40 transition-all duration-200 shadow-sm space-y-2 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-(--profile-primary)/10 text-(--profile-primary) group-hover:scale-105 transition-transform">
                  <DynamicIcon name={service.icon} className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-(--profile-text)">
                  {service.title}
                </h3>
              </div>

              {service.price && (
                <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-(--profile-primary)/10 text-(--profile-primary) border border-(--profile-primary)/20">
                  {service.price}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-(--profile-muted) pl-12">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
