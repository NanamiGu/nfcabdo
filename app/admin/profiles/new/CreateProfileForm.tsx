"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createProfileAction } from "./actions";

const initialState = {
  error: "",
};

export default function CreateProfileForm() {
  const [state, formAction, pending] = useActionState(
    createProfileAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-6"
    >

      {/* Profile Type */}
      <section className="rounded-xl border bg-white p-6">

        <h2 className="mb-5 text-lg font-semibold">
          Profile Type
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">

          <label className="cursor-pointer rounded-lg border p-4">
            <input
              type="radio"
              name="type"
              value="person"
              defaultChecked
              className="mr-2"
            />

            <span className="font-medium">
              Person
            </span>

            <p className="mt-1 text-sm text-gray-500">
              Personal NFC profile
            </p>
          </label>

          <label className="cursor-pointer rounded-lg border p-4">
            <input
              type="radio"
              name="type"
              value="company"
              className="mr-2"
            />

            <span className="font-medium">
              Company
            </span>

            <p className="mt-1 text-sm text-gray-500">
              Business NFC profile
            </p>
          </label>

        </div>

      </section>

      {/* Basic Information */}
      <section className="rounded-xl border bg-white p-6">

        <h2 className="mb-5 text-lg font-semibold">
          Basic Information
        </h2>

        <div className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Name *
            </label>

            <input
              name="name"
              type="text"
              required
              placeholder="Artex"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Slug *
            </label>

            <div className="flex items-center rounded-lg border bg-white">
              <span className="pl-4 text-gray-400">
                /
              </span>

              <input
                name="slug"
                type="text"
                required
                placeholder="artex"
                className="w-full border-0 px-2 py-3 outline-none"
              />
            </div>

            <p className="mt-1 text-xs text-gray-500">
              This will be used for the public profile URL.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Title
            </label>

            <input
              name="title"
              type="text"
              placeholder="Creative Agency"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Subtitle
            </label>

            <input
              name="subtitle"
              type="text"
              placeholder="Designing brands that stand out"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Bio
            </label>

            <textarea
              name="bio"
              rows={5}
              placeholder="Tell people about this person or company..."
              className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-black"
            />
          </div>

        </div>

      </section>

      {/* Contact */}
      <section className="rounded-xl border bg-white p-6">

        <h2 className="mb-5 text-lg font-semibold">
          Contact
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone
            </label>

            <input
              name="phone"
              type="tel"
              placeholder="+213..."
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              WhatsApp
            </label>

            <input
              name="whatsapp"
              type="tel"
              placeholder="+213..."
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              name="email"
              type="email"
              placeholder="contact@example.com"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Website
            </label>

            <input
              name="website"
              type="url"
              placeholder="https://example.com"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />
          </div>

        </div>

      </section>

      {/* Status */}
      <section className="rounded-xl border bg-white p-6">

        <h2 className="mb-5 text-lg font-semibold">
          Status
        </h2>

        <select
          name="status"
          defaultValue="draft"
          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
        >
          <option value="draft">
            Draft
          </option>

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>
        </select>

      </section>

      {/* Error */}
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">

        <Link
          href="/admin"
          className="rounded-lg border bg-white px-5 py-3 text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Creating..." : "Create Profile"}
        </button>

      </div>

    </form>
  );
}