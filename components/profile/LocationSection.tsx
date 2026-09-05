import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { ProfileLocation } from "@/types/profile";
import { formatMapsUrl } from "@/lib/urls";

interface LocationSectionProps {
  location?: ProfileLocation;
  showLocation?: boolean;
}

export function LocationSection({
  location,
  showLocation = true,
}: LocationSectionProps) {
  if (!showLocation || !location) return null;

  const hasAnyAddress = Boolean(
    location.address || location.city || location.country || location.googleMapsUrl
  );
  if (!hasAnyAddress) return null;

  const mapsUrl = formatMapsUrl(location);

  return (
    <section aria-labelledby="location-heading" className="w-full space-y-3.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-(--profile-primary)" />
          <h2
            id="location-heading"
            className="text-sm font-bold tracking-wider uppercase text-(--profile-muted)"
          >
            Location & Directions
          </h2>
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-(--profile-radius) bg-(--profile-surface) border border-(--profile-border) shadow-sm space-y-3.5">
        <div className="space-y-1">
          {location.address && (
            <p className="text-sm font-semibold text-(--profile-text)">
              {location.address}
            </p>
          )}
          {(location.city || location.country) && (
            <p className="text-xs sm:text-sm text-(--profile-muted)">
              {[location.city, location.country].filter(Boolean).join(", ")}
            </p>
          )}
        </div>

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full h-11 px-4 rounded-(--profile-radius) bg-(--profile-primary)/10 hover:bg-(--profile-primary)/20 text-(--profile-primary) border border-(--profile-primary)/30 text-xs sm:text-sm font-semibold transition-all active:scale-[0.98]"
            aria-label="Open directions in Google Maps (opens in a new tab)"
          >
            <Navigation className="w-4 h-4 fill-current" />
            <span>Open in Google Maps</span>
          </a>
        )}
      </div>
    </section>
  );
}
