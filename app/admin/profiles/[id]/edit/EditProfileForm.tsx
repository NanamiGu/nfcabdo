"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  User,
  Building2,
  Phone,
  MessageSquare,
  Mail,
  Globe,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Link2,
  Save,
} from "lucide-react";
import type { Profile } from "@/types/profile";
import { updateProfileAction } from "./actions";

const initialState = {
  error: "",
};

interface EditProfileFormProps {
  profile: Profile;
}

export default function EditProfileForm({ profile }: EditProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialState
  );

  const [profileType, setProfileType] = useState<"person" | "company">(profile.type);
  const [name, setName] = useState(profile.profile.name);
  const [slug, setSlug] = useState(profile.slug || "");

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden Profile ID */}
      <input type="hidden" name="id" value={profile.id} />

      {/* 1. Profile Type Selection */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-slate-500" />
          <h2 className="text-base font-semibold text-slate-900">
            Profile Type
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Select whether this card represents an individual professional or a company.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Person Card */}
          <label
            onClick={() => setProfileType("person")}
            className={`relative flex cursor-pointer items-start gap-4 rounded-xl border p-4.5 transition-all ${
              profileType === "person"
                ? "border-slate-900 bg-slate-50/70 ring-1 ring-slate-900/10 shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30"
            }`}
          >
            <input
              type="radio"
              name="type"
              value="person"
              checked={profileType === "person"}
              onChange={() => setProfileType("person")}
              className="sr-only"
            />

            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                profileType === "person"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-100 text-slate-500 border-slate-200"
              }`}
            >
              <User className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 text-sm">
                  Personal Profile
                </span>
                {profileType === "person" && (
                  <CheckCircle2 className="h-4 w-4 text-slate-900" />
                )}
              </div>
              <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                For founders, consultants, creators, and professionals.
              </p>
            </div>
          </label>

          {/* Company Card */}
          <label
            onClick={() => setProfileType("company")}
            className={`relative flex cursor-pointer items-start gap-4 rounded-xl border p-4.5 transition-all ${
              profileType === "company"
                ? "border-slate-900 bg-slate-50/70 ring-1 ring-slate-900/10 shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30"
            }`}
          >
            <input
              type="radio"
              name="type"
              value="company"
              checked={profileType === "company"}
              onChange={() => setProfileType("company")}
              className="sr-only"
            />

            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                profileType === "company"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-100 text-slate-500 border-slate-200"
              }`}
            >
              <Building2 className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 text-sm">
                  Company Profile
                </span>
                {profileType === "company" && (
                  <CheckCircle2 className="h-4 w-4 text-slate-900" />
                )}
              </div>
              <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                For agencies, brands, studios, and corporate teams.
              </p>
            </div>
          </label>
        </div>
      </section>

      {/* 2. Basic Information */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Basic Information
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Core identity and headline details displayed on the digital profile.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Name */}
          <div className="sm:col-span-2">
            <label
              htmlFor="edit-name"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
            >
              Full Name or Company Name <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition shadow-2xs"
            />
          </div>

          {/* Slug */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="edit-slug"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Profile URL Slug <span className="text-red-500">*</span>
              </label>

              {slug && (
                <span className="text-xs text-slate-500 font-mono">
                  Current: <span className="text-slate-900 font-semibold">/{slug}</span>
                </span>
              )}
            </div>

            <div className="flex items-center rounded-xl border border-slate-300 bg-white shadow-2xs focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10 transition overflow-hidden">
              <div className="flex items-center gap-1 bg-slate-50 border-r border-slate-200 px-3.5 py-3 text-xs text-slate-500 select-none">
                <Link2 className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-mono font-medium">/</span>
              </div>
              <input
                id="edit-slug"
                name="slug"
                type="text"
                required
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-_]/g, "")
                  )
                }
                placeholder="alex-morgan"
                className="w-full border-0 bg-transparent px-3 py-3 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              The direct address accessed via NFC tap or QR scan.
            </p>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="edit-title"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
            >
              Professional Title / Tagline
            </label>
            <input
              id="edit-title"
              name="title"
              type="text"
              defaultValue={profile.profile.title || ""}
              placeholder="Lead Product Designer"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition shadow-2xs"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label
              htmlFor="edit-subtitle"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
            >
              Subtitle / Department
            </label>
            <input
              id="edit-subtitle"
              name="subtitle"
              type="text"
              defaultValue={profile.profile.subtitle || ""}
              placeholder="Product & Design Systems"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition shadow-2xs"
            />
          </div>

          {/* Bio */}
          <div className="sm:col-span-2">
            <label
              htmlFor="edit-bio"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
            >
              Bio / About Summary
            </label>
            <textarea
              id="edit-bio"
              name="bio"
              rows={4}
              defaultValue={profile.profile.bio || ""}
              placeholder="A brief overview introducing the person or business to visitors on the card..."
              className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition shadow-2xs"
            />
          </div>
        </div>
      </section>

      {/* 3. Contact & Tap Actions */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Contact Actions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant tap-to-connect buttons generated on the digital card.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Phone */}
          <div>
            <label
              htmlFor="edit-phone"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
            >
              Phone Number
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Phone className="h-4 w-4" />
              </div>
              <input
                id="edit-phone"
                name="phone"
                type="tel"
                defaultValue={profile.contact?.phone || ""}
                placeholder="+213 550 123 456"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition shadow-2xs"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <label
              htmlFor="edit-whatsapp"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
            >
              WhatsApp
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <MessageSquare className="h-4 w-4" />
              </div>
              <input
                id="edit-whatsapp"
                name="whatsapp"
                type="tel"
                defaultValue={profile.contact?.whatsapp || ""}
                placeholder="+213 550 123 456"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition shadow-2xs"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="edit-email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="edit-email"
                name="email"
                type="email"
                defaultValue={profile.contact?.email || ""}
                placeholder="contact@nexus.com"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition shadow-2xs"
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label
              htmlFor="edit-website"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
            >
              Website URL
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Globe className="h-4 w-4" />
              </div>
              <input
                id="edit-website"
                name="website"
                type="url"
                defaultValue={profile.contact?.website || ""}
                placeholder="https://nexus.com"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition shadow-2xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Profile Status */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900">
          Publishing Status
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 mb-4">
          Control accessibility of this profile across NFC cards and public URLs.
        </p>

        <select
          name="status"
          defaultValue={profile.status || "draft"}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition shadow-2xs cursor-pointer"
        >
          <option value="draft">
            Draft — Profile is hidden from the public while being prepared
          </option>
          <option value="active">
            Active — Profile is live and directly accessible via public URL & NFC
          </option>
          <option value="inactive">
            Inactive — Profile is disabled and temporarily inaccessible
          </option>
        </select>
      </section>

      {/* Error Alert */}
      {state?.error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-2xs">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Unable to save profile</p>
            <p className="mt-0.5 text-xs text-red-700">{state.error}</p>
          </div>
        </div>
      )}

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/admin"
          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-black hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-900/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
