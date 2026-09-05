import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CreateProfileForm from "./CreateProfileForm";

export default function NewProfilePage() {
  return (
    <main className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Back Navigation & Breadcrumb */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="mt-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Create Client Profile
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Configure profile info, contact tap links, and public URL slug for this digital NFC card.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <CreateProfileForm />
    </main>
  );
}