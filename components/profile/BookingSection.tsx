import React from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { ProfileBooking } from "@/types/profile";
import { sanitizeUrl } from "@/lib/urls";

interface BookingSectionProps {
  booking?: ProfileBooking;
  showBooking?: boolean;
}

export function BookingSection({
  booking,
  showBooking = true,
}: BookingSectionProps) {
  if (!showBooking || !booking || !booking.enabled || !booking.url) {
    return null;
  }

  const bookingUrl = sanitizeUrl(booking.url);

  return (
    <section aria-labelledby="booking-heading" className="w-full">
      <div className="p-5 sm:p-6 rounded-(--profile-radius) bg-linear-to-br from-(--profile-surface) to-(--profile-primary)/10 border border-(--profile-primary)/30 shadow-md space-y-3.5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--profile-primary)">
          <Calendar className="w-4 h-4" />
          <span id="booking-heading">Online Scheduling</span>
        </div>

        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-(--profile-text)">
            {booking.title || "Schedule an Appointment"}
          </h3>
          {booking.description && (
            <p className="text-xs sm:text-sm text-(--profile-muted) leading-relaxed">
              {booking.description}
            </p>
          )}
        </div>

        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full h-11 sm:h-12 px-5 rounded-(--profile-radius) bg-(--profile-primary) text-black dark:text-neutral-950 font-bold text-xs sm:text-sm shadow hover:opacity-90 active:scale-[0.98] transition-all"
          aria-label={`Book online meeting (opens scheduling page in new tab)`}
        >
          <span>Pick Date & Time</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
