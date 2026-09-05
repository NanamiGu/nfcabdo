"use client";

import React, { useState } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

interface SectionAccordionProps {
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  isOpenDefault?: boolean;
  isVisible?: boolean;
  onToggleVisibility?: (visible: boolean) => void;
  children: React.ReactNode;
}

export function SectionAccordion({
  title,
  description,
  icon: Icon,
  count,
  isOpenDefault = false,
  isVisible = true,
  onToggleVisibility,
  children,
}: SectionAccordionProps) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 shadow-xs ${
        isVisible
          ? "border-slate-200/90 bg-white"
          : "border-slate-200 bg-slate-50/60 opacity-80"
      }`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between p-4 sm:p-5 gap-3">
        {/* Click to expand/collapse */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex items-start sm:items-center gap-3.5 text-left cursor-pointer group"
          aria-expanded={isOpen}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isVisible
                ? "bg-slate-100 group-hover:bg-slate-200 text-slate-800"
                : "bg-slate-200/70 text-slate-400"
            }`}
          >
            <Icon className="w-4.5 h-4.5" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                {title}
              </h3>
              {typeof count === "number" && (
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {count}
                </span>
              )}
              {!isVisible && (
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Hidden on Card
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-1">
                {description}
              </p>
            )}
          </div>
        </button>

        {/* Visibility toggle switch + expand chevron */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onToggleVisibility && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(!isVisible);
              }}
              title={isVisible ? "Hide section on card" : "Show section on card"}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isVisible
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                  : "bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300"
              }`}
            >
              {isVisible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Accordion Body */}
      {isOpen && (
        <div className="border-t border-slate-100 p-4 sm:p-6 space-y-5 bg-white rounded-b-2xl">
          {children}
        </div>
      )}
    </div>
  );
}
