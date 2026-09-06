import React from "react";
import { Star, Quote } from "lucide-react";
import { Testimonial } from "@/types/profile";

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  showTestimonials?: boolean;
}

/**
 * TestimonialsSection (Server Component)
 */
export function TestimonialsSection({
  testimonials,
  showTestimonials = true,
}: TestimonialsSectionProps) {
  if (!showTestimonials || !testimonials || testimonials.length === 0) {
    return null;
  }

  const visibleItems = testimonials.filter((t) => t.visible !== false);
  if (visibleItems.length === 0) {
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
            Endorsements & Testimonials
          </h2>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-(--profile-surface) text-(--profile-muted) border border-(--profile-border)">
          {visibleItems.length}
        </span>
      </div>

      <div className="space-y-3">
        {visibleItems.map((t, idx) => {
          const quoteText = t.content || t.text || t.quote || "";
          const authorName = t.name || t.author || "Client";

          if (!quoteText.trim()) return null;

          return (
            <div
              key={t.id || `${authorName}-${idx}`}
              className="p-4 sm:p-5 rounded-(--profile-radius) bg-(--profile-surface) border border-(--profile-border) shadow-sm space-y-3"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: Math.max(1, Math.min(5, Math.round(Number(t.rating) || 5))) }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-(--profile-text)/90 leading-relaxed italic">
                &ldquo;{quoteText}&rdquo;
              </p>

              {/* Author details */}
              <div className="pt-2 border-t border-(--profile-border) flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  {t.avatar && (
                    <img
                      src={t.avatar}
                      alt={authorName}
                      className="w-7 h-7 rounded-full object-cover border border-(--profile-border)"
                    />
                  )}
                  <span className="font-bold text-(--profile-text)">
                    {authorName}
                  </span>
                </div>
                <span className="text-(--profile-muted) truncate max-w-50 text-right">
                  {[t.role, t.company].filter(Boolean).join(" • ")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
