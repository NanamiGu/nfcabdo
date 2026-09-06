"use client";

import React, { useState } from "react";
import { ProfileLink } from "@/types/profile";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from "lucide-react";

interface LinksManagerProps {
  links: ProfileLink[];
  onChange: (links: ProfileLink[]) => void;
}

export function LinksManager({ links, onChange }: LinksManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState<Partial<ProfileLink>>({});

  const handleStartAdd = () => {
    setDraft({
      id: `link-${Date.now()}`,
      title: "",
      url: "",
      description: "",
      highlight: false,
      icon: "link",
      visible: true,
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (link: ProfileLink, index: number) => {
    setDraft({
      ...link,
      id: link.id || `link-${index}`,
      visible: link.visible !== false,
      highlight: Boolean(link.highlight),
    });
    setEditingId(link.id || `link-${index}`);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!draft.title?.trim() || !draft.url?.trim()) return;

    const cleanLink: ProfileLink = {
      id: draft.id || `link-${Date.now()}`,
      title: draft.title.trim(),
      url: draft.url.trim(),
      description: draft.description?.trim() || undefined,
      highlight: Boolean(draft.highlight),
      icon: draft.icon?.trim() || "link",
      visible: draft.visible !== false,
    };

    if (isAdding) {
      onChange([...links, cleanLink]);
      setIsAdding(false);
    } else if (editingId) {
      onChange(
        links.map((l, idx) =>
          (l.id || `link-${idx}`) === editingId ? cleanLink : l
        )
      );
      setEditingId(null);
    }
    setDraft({});
  };

  const handleDelete = (index: number) => {
    onChange(links.filter((_, idx) => idx !== index));
    if (editingId) setEditingId(null);
  };

  const handleToggleVisibility = (index: number) => {
    onChange(
      links.map((l, idx) =>
        idx === index ? { ...l, visible: l.visible === false } : l
      )
    );
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const updated = [...links];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        {links.map((link, index) => {
          const isItemEditing = (link.id || `link-${index}`) === editingId;
          const isVisible = link.visible !== false;

          return (
            <div
              key={link.id || `${link.title}-${index}`}
              className={`rounded-xl border transition-all ${
                isItemEditing
                  ? "border-slate-900 bg-slate-50/50 p-4 shadow-sm"
                  : isVisible
                  ? "border-slate-200 bg-white p-3.5 hover:border-slate-300"
                  : "border-slate-200 bg-slate-50/60 p-3.5 opacity-70"
              }`}
            >
              {!isItemEditing ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex flex-col items-center gap-0.5 text-slate-400">
                      <button
                        type="button"
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(index, "down")}
                        disabled={index === links.length - 1}
                        title="Move Down"
                        className="p-1 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                          {link.title}
                        </h4>
                        {link.highlight && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-md">
                        {link.url}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(index)}
                      title={isVisible ? "Hide link" : "Show link"}
                      className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isVisible
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                          : "bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300"
                      }`}
                    >
                      {isVisible ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartEdit(link, index)}
                      title="Edit Link"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      title="Delete Link"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-rose-600 text-xs cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <LinkEditorForm
                  draft={draft}
                  setDraft={setDraft}
                  onSave={handleSave}
                  onCancel={() => {
                    setEditingId(null);
                    setDraft({});
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {isAdding ? (
        <div className="rounded-xl border border-slate-900 bg-slate-50/50 p-4 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
            Add Featured Link
          </h4>
          <LinkEditorForm
            draft={draft}
            setDraft={setDraft}
            onSave={handleSave}
            onCancel={() => {
              setIsAdding(false);
              setDraft({});
            }}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={handleStartAdd}
          className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-slate-500 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Link or Action</span>
        </button>
      )}
    </div>
  );
}

interface LinkEditorProps {
  draft: Partial<ProfileLink>;
  setDraft: React.Dispatch<React.SetStateAction<Partial<ProfileLink>>>;
  onSave: () => void;
  onCancel: () => void;
}

function LinkEditorForm({ draft, setDraft, onSave, onCancel }: LinkEditorProps) {
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Link Title *
          </label>
          <input
            type="text"
            value={draft.title || ""}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="e.g. Visit Our Portfolio or Read Blog"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Destination URL *
          </label>
          <input
            type="url"
            value={draft.url || ""}
            onChange={(e) => setDraft({ ...draft, url: e.target.value })}
            placeholder="https://..."
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-700 uppercase">
          Subtitle / Description
        </label>
        <input
          type="text"
          value={draft.description || ""}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="Brief description or teaser below the title."
          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        />
      </div>

      {/* Featured Highlight Checkbox */}
      <label className="flex items-center gap-2.5 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={Boolean(draft.highlight)}
          onChange={(e) => setDraft({ ...draft, highlight: e.target.checked })}
          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
        />
        <span className="text-xs font-semibold text-slate-800">
          Highlight this link (Special gradient badge & accent border)
        </span>
      </label>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!draft.title?.trim() || !draft.url?.trim()}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-lg cursor-pointer transition-colors"
        >
          Save Link
        </button>
      </div>
    </div>
  );
}
