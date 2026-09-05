import React from "react";
import { Phone, Mail, Globe, MapPin, MessageSquare } from "lucide-react";
import { ProfileContact, ProfileLocation } from "@/types/profile";
import { formatEmailUrl, formatMapsUrl, formatPhoneUrl, formatWhatsAppUrl, sanitizeUrl } from "@/lib/urls";

interface ContactActionsProps {
  contact?: ProfileContact;
  location?: ProfileLocation;
}

export function ContactActions({ contact, location }: ContactActionsProps) {
  if (!contact) return null;

  const whatsappUrl = contact.whatsapp ? formatWhatsAppUrl(contact.whatsapp) : "";
  const phoneUrl = contact.phone ? formatPhoneUrl(contact.phone) : "";
  const emailUrl = contact.email ? formatEmailUrl(contact.email) : "";
  const websiteUrl = contact.website ? sanitizeUrl(contact.website) : "";
  const mapsUrl = location ? formatMapsUrl(location) : "";

  // Secondary actions list
  const secondaryActions = [
    phoneUrl && {
      label: "Call",
      href: phoneUrl,
      icon: Phone,
      ariaLabel: `Call phone number ${contact.phone}`,
      isExternal: false,
    },
    emailUrl && {
      label: "Email",
      href: emailUrl,
      icon: Mail,
      ariaLabel: `Send email to ${contact.email}`,
      isExternal: false,
    },
    websiteUrl && {
      label: "Website",
      href: websiteUrl,
      icon: Globe,
      ariaLabel: "Visit official website",
      isExternal: true,
    },
    mapsUrl && {
      label: "Directions",
      href: mapsUrl,
      icon: MapPin,
      ariaLabel: "Get directions on Google Maps",
      isExternal: true,
    },
  ].filter(Boolean) as Array<{
    label: string;
    href: string;
    icon: React.FC<{ className?: string }>;
    ariaLabel: string;
    isExternal: boolean;
  }>;

  const hasAnyAction = Boolean(whatsappUrl || secondaryActions.length > 0);
  if (!hasAnyAction) return null;

  return (
    <section aria-label="Quick Contact Actions" className="w-full space-y-2.5">
      {/* Primary WhatsApp CTA if present */}
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="w-full h-12 sm:h-13 px-5 rounded-(--profile-radius) font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md active:scale-[0.98] transition-all duration-150 cursor-pointer"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span>Chat on WhatsApp</span>
        </a>
      )}

      {/* Grid of secondary actions */}
      {secondaryActions.length > 0 && (
        <div
          className={`grid gap-2 sm:gap-2.5 ${
            secondaryActions.length === 1
              ? "grid-cols-1"
              : secondaryActions.length === 2
              ? "grid-cols-2"
              : secondaryActions.length === 3
              ? "grid-cols-3"
              : "grid-cols-2 sm:grid-cols-4"
          }`}
        >
          {secondaryActions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.label}
                href={action.href}
                target={action.isExternal ? "_blank" : undefined}
                rel={action.isExternal ? "noopener noreferrer" : undefined}
                aria-label={action.ariaLabel}
                className="h-11 sm:h-12 px-3 rounded-(--profile-radius) bg-(--profile-surface) hover:bg-(--profile-surface-hover) border border-(--profile-border) text-(--profile-text) text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.97] shadow-sm"
              >
                <Icon className="w-4 h-4 text-(--profile-primary) shrink-0" />
                <span className="truncate">{action.label}</span>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
