import Link from "next/link";
import CreateProfileForm from "./CreateProfileForm";

export default function NewProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="mt-4 text-3xl font-bold">
            Create Client
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create a new NFC profile.
          </p>
        </div>

        <CreateProfileForm />

      </div>
    </main>
  );
}