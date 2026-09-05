import Link from "next/link";
import { getProfiles } from "@/data/client";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  ExternalLink,
  User,
  Building2,
  CreditCard,
  Pencil,
} from "lucide-react";

export default async function AdminPage() {
  const profiles = await getProfiles();

  const total = profiles.length;
  const active = profiles.filter(
    (profile) => profile.status === "active"
  ).length;
  const draft = profiles.filter(
    (profile) => profile.status === "draft"
  ).length;
  const inactive = profiles.filter(
    (profile) => profile.status === "inactive"
  ).length;

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Profiles Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your NFC clients, digital business cards, and live public profiles.
          </p>
        </div>

        <Link
          href="/admin/profiles/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-black hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-900/20 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Create Client</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Profiles"
          value={total}
          description="Registered profiles"
          icon={<Users className="h-5 w-5 text-slate-600" />}
        />

        <StatCard
          title="Active Cards"
          value={active}
          description="Publicly accessible"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
        />

        <StatCard
          title="Drafts"
          value={draft}
          description="In preparation"
          icon={<Clock className="h-5 w-5 text-amber-600" />}
        />

        <StatCard
          title="Inactive"
          value={inactive}
          description="Paused or archived"
          icon={<XCircle className="h-5 w-5 text-slate-400" />}
        />
      </div>

      {/* Profiles Directory */}
      <section className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-200/70 px-6 py-4 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <h2 className="font-semibold text-slate-900 text-base">
              All Profiles
            </h2>
            <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              {total}
            </span>
          </div>

          <p className="text-xs text-slate-400 hidden sm:block">
            Auto-synced with Supabase
          </p>
        </div>

        {profiles.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
              <CreditCard className="h-7 w-7" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              No profiles created yet
            </h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
              Get started by creating your first personal or business NFC digital card.
            </p>
            <div className="mt-6">
              <Link
                href="/admin/profiles/new"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-black transition"
              >
                <Plus className="h-4 w-4" />
                <span>Create first client</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {profiles.map((profile) => {
              const isCompany = profile.type === "company";
              const isActive = profile.status === "active";
              const isDraft = profile.status === "draft";

              return (
                <div
                  key={profile.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:px-6 gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Avatar / Type Icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                        isCompany
                          ? "bg-purple-50/70 border-purple-200/70 text-purple-700"
                          : "bg-sky-50/70 border-sky-200/70 text-sky-700"
                      }`}
                    >
                      {isCompany ? (
                        <Building2 className="h-5 w-5" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>

                    {/* Profile Information */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 text-base leading-snug">
                          {profile.profile.name}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500">
                        {profile.profile.title && (
                          <span>{profile.profile.title}</span>
                        )}
                        {profile.profile.title && profile.slug && (
                          <span className="text-slate-300">•</span>
                        )}
                        {profile.slug && (
                          <span className="font-mono text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200/60">
                            /{profile.slug}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pl-14 sm:pl-0">
                    {/* Type Badge */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border ${
                        isCompany
                          ? "bg-purple-50 text-purple-700 border-purple-200/60"
                          : "bg-sky-50 text-sky-700 border-sky-200/60"
                      }`}
                    >
                      {isCompany ? (
                        <>
                          <Building2 className="h-3 w-3" />
                          <span>Company</span>
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3" />
                          <span>Person</span>
                        </>
                      )}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                          : isDraft
                          ? "bg-amber-50 text-amber-700 border-amber-200/60"
                          : "bg-slate-100 text-slate-600 border-slate-200/60"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive
                            ? "bg-emerald-500"
                            : isDraft
                            ? "bg-amber-500"
                            : "bg-slate-400"
                        }`}
                      />
                      <span className="capitalize">{profile.status}</span>
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {profile.id && (
                        <Link
                          href={`/admin/profiles/${profile.id}/edit`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900"
                        >
                          <Pencil className="h-3.5 w-3.5 text-slate-500" />
                          <span>Edit</span>
                        </Link>
                      )}

                      {profile.slug && (
                        <Link
                          href={`/${profile.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900"
                        >
                          <span>View</span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {title}
        </p>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
          {value}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}