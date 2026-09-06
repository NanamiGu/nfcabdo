"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Profile, ProfileType } from "@/types/profile";
import { getDefaultProfile, SOCIAL_PLATFORMS } from "./types";
import { LivePhonePreview } from "./LivePhonePreview";
import { SectionAccordion } from "./SectionAccordion";
import { ImageUploadField } from "./ImageUploadField";
import { ThemeSelector } from "./ThemeSelector";
import { ServicesManager } from "./ServicesManager";
import { ProjectsManager } from "./ProjectsManager";
import { ProductsManager } from "./ProductsManager";
import { TestimonialsManager } from "./TestimonialsManager";
import { LinksManager } from "./LinksManager";
import { ExperienceManager } from "./ExperienceManager";
import { EducationManager } from "./EducationManager";
import { SkillsManager } from "./SkillsManager";
import { ResourcesManager } from "./ResourcesManager";
import { saveProfileFullAction } from "@/app/admin/profiles/new/actions";
import { updateProfileFullAction } from "@/app/admin/profiles/[id]/edit/actions";
import {
  User,
  Building2,
  Phone,
  Mail,
  Globe,
  Share2,
  Briefcase,
  FolderGit2,
  ShoppingBag,
  Quote,
  Link2,
  GraduationCap,
  Sparkles,
  Download,
  MapPin,
  Calendar,
  Palette,
  ArrowLeft,
  Save,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Smartphone,
  Sliders,
} from "lucide-react";

interface ProfileBuilderProps {
  initialProfile?: Profile;
  profileId?: string;
}

export function ProfileBuilder({ initialProfile, profileId }: ProfileBuilderProps = {}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Master profile state
  const [profile, setProfile] = useState<Profile>(
    () => initialProfile || getDefaultProfile("person")
  );
  const [activeMobileTab, setActiveMobileTab] = useState<"edit" | "preview">("edit");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    Boolean(initialProfile?.slug)
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState<"draft" | "active" | null>(null);

  const isCompany = profile.type === "company";

  // Switch between Person and Company profile type
  const handleTypeChange = (newType: ProfileType) => {
    if (newType === profile.type) return;
    const next = getDefaultProfile(newType);
    setProfile({
      ...next,
      slug: profile.slug,
      theme: profile.theme,
    });
  };

  // Auto-generate slug from name if not manually modified
  const handleNameChange = (name: string) => {
    const updatedInfo = { ...profile.profile, name };
    if (!slugManuallyEdited) {
      const generatedSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setProfile({
        ...profile,
        slug: generatedSlug,
        profile: updatedInfo,
      });
    } else {
      setProfile({ ...profile, profile: updatedInfo });
    }
  };

  const handleSlugChange = (rawSlug: string) => {
    setSlugManuallyEdited(true);
    const cleaned = rawSlug
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");
    setProfile({ ...profile, slug: cleaned });
  };

  // Save or Publish
  const handleSave = (targetStatus: "draft" | "active") => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setSavingStatus(targetStatus);

    startTransition(async () => {
      const res = profileId
        ? await updateProfileFullAction(profileId, profile, targetStatus)
        : await saveProfileFullAction(profile, targetStatus);
      setSavingStatus(null);

      if (!res.success) {
        setErrorMessage(res.error || "Failed to save profile.");
        // Scroll to top to see error
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSuccessMessage(
          targetStatus === "active"
            ? `Profile published successfully! Live at /${res.slug}`
            : `Profile draft saved successfully!`
        );
        setTimeout(() => {
          router.push("/admin");
        }, 1200);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top sticky navigation header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Return to Admin Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  {profileId ? `Edit: ${profile.profile.name}` : "NFC Profile Builder"}
                </h1>
                <span className="shrink-0 text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider text-[10px]">
                  {isCompany ? "Company" : "Personal"}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate hidden sm:block">
                Configure content, contact actions, and interactive preview for this digital card.
              </p>
            </div>
          </div>

          {/* Actions & Mobile View Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile View Toggle */}
            <div className="flex items-center lg:hidden bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveMobileTab("edit")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeMobileTab === "edit"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveMobileTab("preview")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  activeMobileTab === "preview"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

            {/* Save Draft */}
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleSave("draft")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingStatus === "draft" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Save Draft</span>
              <span className="sm:hidden">Draft</span>
            </button>

            {/* Publish Button */}
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleSave("active")}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingStatus === "active" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Publish Card</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid: Builder Form on Left, Sticky Phone Mockup on Right */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Alerts */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold uppercase tracking-wider">Error Saving Profile</p>
              <p className="text-xs">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold uppercase tracking-wider">Success</p>
              <p className="text-xs">{successMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Builder Sections */}
          <div
            className={`space-y-5 lg:col-span-7 ${
              activeMobileTab === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            {/* 1. Profile Type Switcher */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-700" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Profile Archetype
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeChange("person")}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                    !isCompany
                      ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900/10 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      !isCompany
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      Personal Profile
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      For executives, founders, freelancers, and professionals.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange("company")}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                    isCompany
                      ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900/10 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isCompany
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      Company Profile
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      For agencies, businesses, corporate brands, and enterprises.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Public URL Slug */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
                NFC Card URL Slug *
              </label>
              <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-slate-900">
                <span className="px-3.5 py-2.5 bg-slate-100 text-slate-500 text-xs font-mono select-none border-r border-slate-300">
                  card/
                </span>
                <input
                  type="text"
                  value={profile.slug || ""}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="e.g. alex-carter or acme-innovations"
                  className="flex-1 px-3.5 py-2.5 text-xs font-mono lowercase bg-white focus:outline-none text-slate-900"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                This forms the permanent digital NFC card link: <span className="font-semibold text-slate-700">/{profile.slug || "slug"}</span>
              </p>
            </div>

            {/* 3. Identity Section */}
            <SectionAccordion
              title={isCompany ? "Company Identity & Branding" : "Personal Identity & Bio"}
              description="Name, headline, avatars, logos, cover banner, and verified status."
              icon={isCompany ? Building2 : User}
              isOpenDefault={true}
              isVisible={profile.settings.showIdentity !== false}
              onToggleVisibility={(v) =>
                setProfile({
                  ...profile,
                  settings: { ...profile.settings, showIdentity: v },
                })
              }
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-slate-700">
                      {isCompany ? "Company Name *" : "Full Name *"}
                    </label>
                    <input
                      type="text"
                      value={profile.profile.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder={isCompany ? "Acme Innovations Inc." : "Alex Carter"}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-slate-700">
                      {isCompany ? "Tagline / Industry Subtitle" : "Professional Title"}
                    </label>
                    <input
                      type="text"
                      value={profile.profile.title || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          profile: { ...profile.profile, title: e.target.value },
                        })
                      }
                      placeholder={
                        isCompany
                          ? "Enterprise AI & Cloud Infrastructure"
                          : "Senior Cloud Architect & Advisor"
                      }
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                    />
                  </div>
                </div>

                {/* Sub-headline / Pronouns / Company */}
                {!isCompany ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold uppercase text-slate-700">
                        Profile Headline
                      </label>
                      <input
                        type="text"
                        value={profile.profile.headline || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            profile: { ...profile.profile, headline: e.target.value },
                          })
                        }
                        placeholder="e.g. Scaling distributed cloud platforms & high-volume microservices"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase text-slate-700">
                        Current Company
                      </label>
                      <input
                        type="text"
                        value={profile.profile.company || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            profile: { ...profile.profile, company: e.target.value },
                          })
                        }
                        placeholder="e.g. Apex Cloud"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase text-slate-700">
                        Industry / Sector
                      </label>
                      <input
                        type="text"
                        value={profile.profile.industry || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            profile: { ...profile.profile, industry: e.target.value },
                          })
                        }
                        placeholder="e.g. Enterprise Software / SaaS"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase text-slate-700">
                        Founded Year
                      </label>
                      <input
                        type="text"
                        value={profile.profile.founded || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            profile: { ...profile.profile, founded: e.target.value },
                          })
                        }
                        placeholder="e.g. 2021"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Avatar / Logo Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <ImageUploadField
                    label={isCompany ? "Company Logo" : "Profile Avatar Photo"}
                    value={isCompany ? profile.profile.logo : (profile.profile.avatar || profile.profile.logo)}
                    onChange={(url) =>
                      setProfile({
                        ...profile,
                        profile: isCompany
                          ? { ...profile.profile, logo: url }
                          : { ...profile.profile, avatar: url, logo: url },
                      })
                    }
                    folder={isCompany ? "logos" : "avatars"}
                    aspectRatio="square"
                  />

                  <ImageUploadField
                    label="Cover Banner Image (Optional)"
                    value={profile.profile.coverImage || ""}
                    onChange={(url) =>
                      setProfile({
                        ...profile,
                        profile: { ...profile.profile, coverImage: url },
                      })
                    }
                    folder="covers"
                    aspectRatio="cover"
                  />
                </div>

                {/* Verified badge toggle */}
                <label className="flex items-center gap-2.5 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={Boolean(profile.profile.verified)}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        profile: { ...profile.profile, verified: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    Show Verified Badge (Authentic profile mark)
                  </span>
                </label>
              </div>
            </SectionAccordion>

            {/* 4. About & Narrative */}
            <SectionAccordion
              title={isCompany ? "About Company & Mission" : "About Me & Biography"}
              description="Detailed biography, summary, company mission, vision, and core competencies."
              icon={Sliders}
              isOpenDefault={false}
              isVisible={profile.settings.showAbout !== false}
              onToggleVisibility={(v) =>
                setProfile({
                  ...profile,
                  settings: { ...profile.settings, showAbout: v },
                })
              }
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-700">
                    {isCompany ? "Company Overview" : "Personal Bio / Story"}
                  </label>
                  <textarea
                    rows={4}
                    value={profile.profile.bio || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        profile: { ...profile.profile, bio: e.target.value },
                      })
                    }
                    placeholder="Provide a compelling overview of background, achievements, and unique strengths."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white leading-relaxed"
                  />
                </div>

                {isCompany && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase text-slate-700">
                        Company Mission Statement
                      </label>
                      <textarea
                        rows={2}
                        value={profile.profile.mission || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            profile: { ...profile.profile, mission: e.target.value },
                          })
                        }
                        placeholder="Our mission is to empower organizations..."
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase text-slate-700">
                        Company Vision Statement
                      </label>
                      <textarea
                        rows={2}
                        value={profile.profile.vision || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            profile: { ...profile.profile, vision: e.target.value },
                          })
                        }
                        placeholder="Building the next generation of interconnected platforms..."
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </SectionAccordion>

            {/* 5. Contact Actions (Tap to Call, WhatsApp, Email, Website) */}
            <SectionAccordion
              title="Primary Contact Actions"
              description="One-tap phone calls, WhatsApp messages, emails, official website, and vCard."
              icon={Phone}
              isOpenDefault={true}
              isVisible={profile.settings.showContact !== false}
              onToggleVisibility={(v) =>
                setProfile({
                  ...profile,
                  settings: { ...profile.settings, showContact: v },
                })
              }
            >
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase text-slate-700 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>Phone Number</span>
                      </label>
                    </div>
                    <input
                      type="tel"
                      value={profile.contact.phone || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          contact: { ...profile.contact, phone: e.target.value },
                        })
                      }
                      placeholder="+1 (555) 234-5678"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>WhatsApp Number</span>
                    </label>
                    <input
                      type="tel"
                      value={profile.contact.whatsapp || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          contact: { ...profile.contact, whatsapp: e.target.value },
                        })
                      }
                      placeholder="+15552345678 (include country code)"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      value={profile.contact.email || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          contact: { ...profile.contact, email: e.target.value },
                        })
                      }
                      placeholder="alex.carter@example.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-slate-700 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                      <span>Official Website</span>
                    </label>
                    <input
                      type="url"
                      value={profile.contact.website || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          contact: { ...profile.contact, website: e.target.value },
                        })
                      }
                      placeholder="https://example.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={profile.settings.showSaveContact !== false}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        settings: { ...profile.settings, showSaveContact: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    Enable &quot;Save Contact to Phone&quot; (vCard / Contact Card download button)
                  </span>
                </label>
              </div>
            </SectionAccordion>

            {/* 6. Social Links */}
            <SectionAccordion
              title="Social Media Links"
              description="Configure 8+ social platforms with individual visibility toggles."
              icon={Share2}
              isOpenDefault={false}
              isVisible={profile.settings.showSocial !== false}
              onToggleVisibility={(v) =>
                setProfile({
                  ...profile,
                  settings: { ...profile.settings, showSocial: v },
                })
              }
            >
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const socialMap = profile.social as Record<string, unknown> | undefined;
                    const currentValue = typeof socialMap?.[platform.id] === "string" ? (socialMap[platform.id] as string) : "";

                    return (
                      <div key={platform.id} className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700 uppercase">
                          {platform.label}
                        </label>
                        <input
                          type="url"
                          value={currentValue}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              social: {
                                ...profile.social,
                                [platform.id]: e.target.value,
                              },
                            })
                          }
                          placeholder={platform.placeholder}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </SectionAccordion>

            {/* 7. Skills & Tech Stack */}
            <SectionAccordion
              title={isCompany ? "Core Competencies & Stack" : "Skills & Technical Expertise"}
              description="Manage skill chips with proficiency levels (Beginner, Intermediate, Advanced, Expert)."
              icon={Sparkles}
              count={profile.skillsList?.length || 0}
              isOpenDefault={false}
              isVisible={profile.settings.showSkills !== false}
              onToggleVisibility={(v) =>
                setProfile({
                  ...profile,
                  settings: { ...profile.settings, showSkills: v },
                })
              }
            >
              <SkillsManager
                skills={profile.skillsList || []}
                onChange={(skillsList) => setProfile({ ...profile, skillsList })}
              />
            </SectionAccordion>

            {/* 8. Work Experience (Personal Only) */}
            {!isCompany && (
              <SectionAccordion
                title="Work History & Experience"
                description="Professional employment timeline, titles, companies, dates, and responsibilities."
                icon={Briefcase}
                count={profile.experience?.length || 0}
                isOpenDefault={false}
                isVisible={profile.settings.showExperience !== false}
                onToggleVisibility={(v) =>
                  setProfile({
                    ...profile,
                    settings: { ...profile.settings, showExperience: v },
                  })
                }
              >
                <ExperienceManager
                  experience={profile.experience || []}
                  onChange={(experience) => setProfile({ ...profile, experience })}
                />
              </SectionAccordion>
            )}

            {/* 9. Education & Degrees (Personal Only) */}
            {!isCompany && (
              <SectionAccordion
                title="Education & Credentials"
                description="Universities, degrees, fields of study, and academic honors."
                icon={GraduationCap}
                count={profile.education?.length || 0}
                isOpenDefault={false}
                isVisible={profile.settings.showEducation !== false}
                onToggleVisibility={(v) =>
                  setProfile({
                    ...profile,
                    settings: { ...profile.settings, showEducation: v },
                  })
                }
              >
                <EducationManager
                  education={profile.education || []}
                  onChange={(education) => setProfile({ ...profile, education })}
                />
              </SectionAccordion>
            )}

            {/* 10. Services & Capabilities */}
            <SectionAccordion
              title="Services & Capabilities"
              description="Productized services, consulting offerings, deliverables, pricing, and turnaround."
              icon={Briefcase}
              count={profile.services?.length || 0}
              isOpenDefault={false}
              isVisible={profile.settings.showServices !== false}
              onToggleVisibility={(v) =>
                setProfile({
                  ...profile,
                  settings: { ...profile.settings, showServices: v },
                })
              }
            >
              <ServicesManager
                services={profile.services || []}
                onChange={(services) => setProfile({ ...profile, services })}
              />
            </SectionAccordion>

            {/* 11. Featured Projects / Portfolio */}
            <SectionAccordion
              title="Featured Projects & Portfolio"
              description="Showcase key case studies, live repositories, screenshots, and metrics."
              icon={FolderGit2}
              count={profile.projects?.length || 0}
              isOpenDefault={false}
              isVisible={profile.settings.showProjects !== false}
              onToggleVisibility={(v) =>
                setProfile({
                  ...profile,
                  settings: { ...profile.settings, showProjects: v },
                })
              }
            >
              <ProjectsManager
                projects={profile.projects || []}
                onChange={(projects) => setProfile({ ...profile, projects })}
              />
            </SectionAccordion>

            {/* 12. Products & Digital Store */}
            <SectionAccordion
              title="Products & Store Items"
              description="Digital goods, courses, software suites, or physical merchandise."
              icon={ShoppingBag}
              count={profile.products?.length || 0}
              isOpenDefault={false}
              isVisible={profile.settings.showProducts !== false}
              onToggleVisibility={(v) =>
                setProfile({
                  ...profile,
                  settings: { ...profile.settings, showProducts: v },
                })
              }
            >
              <ProductsManager
                products={profile.products || []}
                onChange={(products) => setProfile({ ...profile, products })}
              />
            </SectionAccordion>

            {/* 13. Testimonials & Endorsements */}
            <SectionAccordion
              title="Endorsements & Testimonials"
              description="Social proof, client reviews, ratings, and executive endorsements."
              icon={Quote}
              count={profile.testimonials?.length || 0}
              isOpenDefault={false}
              isVisible={profile.settings.showTestimonials !== false}
              onToggleVisibility={(v) =>
                setProfile({
                  ...profile,
                  settings: { ...profile.settings, showTestimonials: v },
                })
              }
            >
              <TestimonialsManager
                testimonials={profile.testimonials || []}
                onChange={(testimonials) => setProfile({ ...profile, testimonials })}
              />
            </SectionAccordion>

            {/* 14. Custom Featured Links */}
            <SectionAccordion
              title="Featured Links & Resources"
              description="Highlighted links, articles, media appearances, or portfolios."
              icon={Link2}
              count={profile.links?.length || 0}
              isOpenDefault={false}
              isVisible={profile.settings.showLinks !== false}
              onToggleVisibility={(v) =>
                setProfile({
                  ...profile,
                  settings: { ...profile.settings, showLinks: v },
                })
              }
            >
              <LinksManager
                links={profile.links || []}
                onChange={(links) => setProfile({ ...profile, links })}
              />
            </SectionAccordion>

            {/* 15. Downloadable Documents */}
            <SectionAccordion
              title="Downloadable Resources (PDF/Brochures)"
              description="Downloadable resumes, corporate capabilities decks, catalogs, or menus."
              icon={Download}
              count={profile.resources?.length || 0}
              isOpenDefault={false}
              isVisible={profile.settings.showResources !== false}
              onToggleVisibility={(v) =>
                setProfile({
                  ...profile,
                  settings: { ...profile.settings, showResources: v },
                })
              }
            >
              <ResourcesManager
                resources={profile.resources || []}
                onChange={(resources) => setProfile({ ...profile, resources })}
              />
            </SectionAccordion>

            {/* 16. Location & Map */}
            <SectionAccordion
              title="Location & Office Address"
              description="Office headquarters, city, country, and direct Google Maps navigation link."
              icon={MapPin}
              isOpenDefault={false}
              isVisible={profile.settings.showLocation !== false}
              onToggleVisibility={(v) =>
                setProfile({
                  ...profile,
                  settings: { ...profile.settings, showLocation: v },
                })
              }
            >
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-slate-700">
                      City
                    </label>
                    <input
                      type="text"
                      value={profile.location?.city || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          location: {
                            ...profile.location,
                            city: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. San Francisco"
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-slate-700">
                      Country
                    </label>
                    <input
                      type="text"
                      value={profile.location?.country || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          location: {
                            ...profile.location,
                            country: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. United States"
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-700">
                    Street Address / Suite
                  </label>
                  <input
                    type="text"
                    value={profile.location?.address || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        location: {
                          ...profile.location,
                          address: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. 500 Howard Street, Suite 400"
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-700">
                    Google Maps URL
                  </label>
                  <input
                    type="url"
                    value={profile.location?.googleMapsUrl || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        location: {
                          ...profile.location,
                          googleMapsUrl: e.target.value,
                        },
                      })
                    }
                    placeholder="https://maps.google.com/..."
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                  />
                </div>
              </div>
            </SectionAccordion>

            {/* 17. Appointment Booking CTA */}
            <SectionAccordion
              title="Online Meeting / Appointment Booking"
              description="Direct integration with Calendly, Cal.com, or booking scheduler."
              icon={Calendar}
              isOpenDefault={false}
              isVisible={profile.settings.showBooking !== false}
              onToggleVisibility={(v) =>
                setProfile({
                  ...profile,
                  settings: { ...profile.settings, showBooking: v },
                })
              }
            >
              <div className="space-y-3.5">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(profile.booking?.enabled)}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        booking: {
                          ...profile.booking,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    Show Appointment Booking Banner
                  </span>
                </label>

                {profile.booking?.enabled && (
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase text-slate-700">
                        Meeting Booking URL *
                      </label>
                      <input
                        type="url"
                        value={profile.booking?.url || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            booking: {
                              ...profile.booking,
                              enabled: true,
                              url: e.target.value,
                            },
                          })
                        }
                        placeholder="https://calendly.com/your-username/30min"
                        className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-slate-700">
                          Booking Headline
                        </label>
                        <input
                          type="text"
                          value={profile.booking?.title || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              booking: {
                                ...profile.booking,
                                enabled: true,
                                title: e.target.value,
                              },
                            })
                          }
                          placeholder="Schedule a 30-Min Discovery Call"
                          className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-slate-700">
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={profile.booking?.ctaText || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              booking: {
                                ...profile.booking,
                                enabled: true,
                                ctaText: e.target.value,
                              },
                            })
                          }
                          placeholder="Book Meeting"
                          className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SectionAccordion>

            {/* 18. Card Theme & Styling */}
            <SectionAccordion
              title="Theme, Colors & Styling"
              description="Customize dark/light mode, curated color palettes, accent colors, and corner radius."
              icon={Palette}
              isOpenDefault={false}
            >
              <ThemeSelector
                theme={profile.theme}
                onChange={(theme) => setProfile({ ...profile, theme })}
              />
            </SectionAccordion>

            {/* Bottom Form Actions */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 text-center sm:text-left">
                Drafts remain private in the dashboard. Publishing makes the card accessible immediately at{" "}
                <span className="font-semibold text-slate-800">/{profile.slug || "slug"}</span>.
              </p>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleSave("draft")}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleSave("active")}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Publish NFC Card
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Realtime Live Phone Mockup Preview */}
          <div
            className={`lg:col-span-5 flex justify-center ${
              activeMobileTab === "edit" ? "hidden lg:flex" : "flex"
            }`}
          >
            <LivePhonePreview profile={profile} />
          </div>
        </div>
      </main>
    </div>
  );
}
