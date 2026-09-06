"use client";

import React, { useState } from "react";
import { ResourceItem } from "@/types/profile";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  FileText,
} from "lucide-react";

interface ResourcesManagerProps {
  resources: ResourceItem[];
  onChange: (resources: ResourceItem[]) => void;
}

export function ResourcesManager({
  resources,
  onChange,
}: ResourcesManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState<Partial<ResourceItem>>({});

  const handleStartAdd = () => {
    setDraft({
      id: `res-${Date.now()}`,
      title: "",
      description: "",
      fileUrl: "",
      fileType: "pdf",
      fileSize: "",
      visible: true,
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (item: ResourceItem, index: number) => {
    setDraft({
      ...item,
      id: item.id || `res-${index}`,
      fileUrl: item.fileUrl || item.url || "",
      visible: item.visible !== false,
    });
    setEditingId(item.id || `res-${index}`);
    setIsAdding(false);
  };

  const handleSave = () => {
    const url = draft.fileUrl || draft.url;
    if (!draft.title?.trim() || !url?.trim()) return;

    const cleanResource: ResourceItem = {
      id: draft.id || `res-${Date.now()}`,
      title: draft.title.trim(),
      description: draft.description?.trim() || undefined,
      fileUrl: url.trim(),
      url: url.trim(),
      fileType: draft.fileType?.trim() || "pdf",
      fileSize: draft.fileSize?.trim() || undefined,
      visible: draft.visible !== false,
    };

    if (isAdding) {
      onChange([...resources, cleanResource]);
      setIsAdding(false);
    } else if (editingId) {
      onChange(
        resources.map((r, idx) =>
          (r.id || `res-${idx}`) === editingId ? cleanResource : r
        )
      );
      setEditingId(null);
    }
    setDraft({});
  };

  const handleDelete = (index: number) => {
    onChange(resources.filter((_, idx) => idx !== index));
    if (editingId) setEditingId(null);
  };

  const handleToggleVisibility = (index: number) => {
    onChange(
      resources.map((r, idx) =>
        idx === index ? { ...r, visible: r.visible === false } : r
      )
    );
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= resources.length) return;

    const updated = [...resources];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        {resources.map((item, index) => {
          const isItemEditing = (item.id || `res-${index}`) === editingId;
          const isVisible = item.visible !== false;

          return (
            <div
              key={item.id || `${item.title}-${index}`}
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
                        disabled={index === resources.length - 1}
                        title="Move Down"
                        className="p-1 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="w-9 h-9 rounded-lg border border-slate-200 shrink-0 bg-slate-100 flex items-center justify-center text-slate-600">
                      <FileText className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                          {item.title}
                        </h4>
                        {item.fileType && (
                          <span className="uppercase text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {item.fileType}
                          </span>
                        )}
                        {item.fileSize && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.fileSize}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-md">
                        {item.description || item.fileUrl || item.url}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(index)}
                      title={isVisible ? "Hide resource" : "Show resource"}
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
                      onClick={() => handleStartEdit(item, index)}
                      title="Edit Resource"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      title="Delete Resource"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-rose-600 text-xs cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <ResourceEditorForm
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
            Add Downloadable Document
          </h4>
          <ResourceEditorForm
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
          <span>Add PDF, Brochure, or Document</span>
        </button>
      )}
    </div>
  );
}

interface ResourceEditorProps {
  draft: Partial<ResourceItem>;
  setDraft: React.Dispatch<React.SetStateAction<Partial<ResourceItem>>>;
  onSave: () => void;
  onCancel: () => void;
}

function ResourceEditorForm({
  draft,
  setDraft,
  onSave,
  onCancel,
}: ResourceEditorProps) {
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Document Title *
          </label>
          <input
            type="text"
            value={draft.title || ""}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="e.g. 2026 Corporate Capabilities Deck"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            File URL *
          </label>
          <input
            type="url"
            value={draft.fileUrl || draft.url || ""}
            onChange={(e) =>
              setDraft({ ...draft, fileUrl: e.target.value, url: e.target.value })
            }
            placeholder="https://..."
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Format / Type
          </label>
          <input
            type="text"
            value={draft.fileType || "pdf"}
            onChange={(e) => setDraft({ ...draft, fileType: e.target.value })}
            placeholder="e.g. PDF, DOCX, ZIP"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            File Size (Optional)
          </label>
          <input
            type="text"
            value={draft.fileSize || ""}
            onChange={(e) => setDraft({ ...draft, fileSize: e.target.value })}
            placeholder="e.g. 2.4 MB"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-700 uppercase">
          Description
        </label>
        <input
          type="text"
          value={draft.description || ""}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="e.g. Complete company overview, client case studies, and pricing."
          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        />
      </div>

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
          disabled={!draft.title?.trim() || !(draft.fileUrl || draft.url)?.trim()}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-lg cursor-pointer transition-colors"
        >
          Save Document
        </button>
      </div>
    </div>
  );
}
