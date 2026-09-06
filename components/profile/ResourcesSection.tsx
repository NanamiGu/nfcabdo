import React from "react";
import { Download, FileText, ArrowDownToLine } from "lucide-react";
import { ResourceItem } from "@/types/profile";
import { sanitizeUrl } from "@/lib/urls";

interface ResourcesSectionProps {
  resources?: ResourceItem[];
  showResources?: boolean;
}

export function ResourcesSection({
  resources,
  showResources = true,
}: ResourcesSectionProps) {
  if (!showResources || !resources || resources.length === 0) {
    return null;
  }

  const visibleItems = resources.filter((item) => item.visible !== false);
  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="resources-heading" className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-(--profile-primary)" />
          <h2
            id="resources-heading"
            className="text-sm font-bold tracking-wider uppercase text-(--profile-muted)"
          >
            Resources & Downloads
          </h2>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-(--profile-surface) text-(--profile-muted) border border-(--profile-border)">
          {visibleItems.length}
        </span>
      </div>

      <div className="space-y-2.5">
        {visibleItems.map((item, idx) => {
          const fileUrl = sanitizeUrl(item.fileUrl || item.url);

          return (
            <a
              key={item.id || `${item.title}-${idx}`}
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="p-4 rounded-(--profile-radius) bg-(--profile-surface) hover:bg-(--profile-surface-hover) border border-(--profile-border) hover:border-(--profile-primary)/40 transition-all duration-150 flex items-center justify-between gap-3 shadow-sm group active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-(--profile-primary)/10 text-(--profile-primary) shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-(--profile-text) block group-hover:text-(--profile-primary) transition-colors">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-(--profile-muted)">
                    {item.description && (
                      <span className="truncate max-w-55">{item.description}</span>
                    )}
                    {item.description && (item.fileType || item.fileSize) && (
                      <span>•</span>
                    )}
                    {item.fileType && (
                      <span className="uppercase text-[10px] font-semibold px-1.5 py-0.5 rounded bg-(--profile-bg) border border-(--profile-border)">
                        {item.fileType}
                      </span>
                    )}
                    {item.fileSize && <span>{item.fileSize}</span>}
                  </div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-(--profile-bg) text-(--profile-muted) group-hover:text-(--profile-primary) group-hover:bg-(--profile-primary)/10 transition-colors shrink-0">
                <ArrowDownToLine className="w-4 h-4" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
