import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getProfileById } from "@/data/client";
import EditProfileForm from "./EditProfileForm";

interface EditProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProfilePage({
  params,
}: EditProfilePageProps) {
  const { id } = await params;
  const profile = await getProfileById(id);

  if (!profile) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Back Navigation & Breadcrumb */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
              Edit Profile: {profile.profile.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Update digital card identity, contact tap actions, and public URL slug.
            </p>
          </div>
        </div>

        {profile.slug && (
          <Link
            href={`/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition self-start sm:self-auto"
          >
            <span>View Live Card</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        )}
      </div>

      {/* Form Card */}
      <EditProfileForm profile={profile} />
    </main>
  );
}
