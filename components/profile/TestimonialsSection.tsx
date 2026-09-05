import React from "react";
import { Star, Quote } from "lucide-react";
import { Testimonial } from "@/types/profile";

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  showTestimonials?: boolean;
}

export function TestimonialsSection({
  testimonials,
  showTestimonials = true,
}: TestimonialsSectionProps) {
  if (!showTestimonials || !testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="testimonials-heading" className="w-full space-y-3.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Quote className="w-4 h-4 text-(--profile-primary)" />
          <h2
            id="testimonials-heading"
            className="text-sm font-bold tracking-wider uppercase text-(--profile-muted)"
          >
            Client Endorsements
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        {testimonials.map((t, idx) => (
          <div
            key={`${t.author}-${idx}`}
            className="p-4 sm:p-5 rounded-(--profile-radius) bg-(--profile-surface) border border-(--profile-border) shadow-sm space-y-3"
          >
            {/* Star Rating */}
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: t.rating || 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-xs sm:text-sm text-(--profile-text)/90 leading-relaxed italic">
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* Author details */}
            <div className="pt-1 border-t border-(--profile-border) flex items-center justify-between text-xs">
              <span className="font-bold text-(--profile-text)">
                {t.author}
              </span>
              <span className="text-(--profile-muted) truncate max-w-50">
                {[t.role, t.company].filter(Boolean).join(" • ")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
