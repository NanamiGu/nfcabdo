"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Building2, User, ChevronDown, ChevronUp, Eye } from "lucide-react";

export function DemoBar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      aria-label="Demo Profile Navigation"
      className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-white/10 text-white shadow-lg transition-all"
    >
      <div className="max-w-xl mx-auto px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-semibold text-neutral-300">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">NFC Profile Showcase:</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/artex"
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              pathname === "/artex" || pathname === "/"
                ? "bg-amber-500 text-black font-bold shadow-sm"
                : "bg-white/10 hover:bg-white/20 text-neutral-300"
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>Company</span>
          </Link>

          <Link
            href="/amine"
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              pathname === "/amine"
                ? "bg-sky-500 text-black font-bold shadow-sm"
                : "bg-white/10 hover:bg-white/20 text-neutral-300"
            }`}
          >
            <User className="w-3 h-3" />
            <span>Personal</span>
          </Link>

          <Link
            href="/minimal"
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              pathname === "/minimal"
                ? "bg-emerald-500 text-black font-bold shadow-sm"
                : "bg-white/10 hover:bg-white/20 text-neutral-300"
            }`}
          >
            <span>Minimal</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
