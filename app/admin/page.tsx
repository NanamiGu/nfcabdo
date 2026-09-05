import Link from "next/link";
import { getProfiles } from "@/data/client";

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
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              NFC Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your NFC profiles.
            </p>
          </div>

          <Link
            href="/admin/profiles/new"
            className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
          >
            + Create Client
          </Link>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Profiles"
            value={total}
          />

          <StatCard
            title="Active"
            value={active}
          />

          <StatCard
            title="Draft"
            value={draft}
          />

          <StatCard
            title="Inactive"
            value={inactive}
          />

        </div>

        {/* Profiles */}
        <section className="rounded-xl border bg-white">

          <div className="border-b px-6 py-4">
            <h2 className="font-semibold">
              Profiles
            </h2>
          </div>

          {profiles.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No profiles yet.
            </div>
          ) : (
            <div className="divide-y">

              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between px-6 py-5"
                >

                  <div>
                    <h3 className="font-medium">
                      {profile.profile.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      /{profile.slug}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">

                    <span className="text-sm capitalize text-gray-500">
                      {profile.type}
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize">
                      {profile.status}
                    </span>

                    {profile.slug && (
                      <Link
                        href={`/${profile.slug}`}
                        target="_blank"
                        className="text-sm underline"
                      >
                        View
                      </Link>
                    )}

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}