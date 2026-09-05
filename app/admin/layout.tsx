import type { Metadata } from "next";
import Link from "next/link";
import { Layers, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "NFC Studio | Admin Dashboard",
  description: "Manage digital NFC profiles and clients",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-slate-900 selection:text-white flex flex-col">
      {/* Top Admin Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 text-sm sm:text-base leading-tight block">
                NFC Studio
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block">
                Admin Console
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <span>Live Card Demo</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
