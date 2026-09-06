"use client";

import React, { useState } from "react";
import { Service } from "@/types/profile";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react";

interface ServicesManagerProps {
  services: Service[];
  onChange: (services: Service[]) => void;
}

export function ServicesManager({ services, onChange }: ServicesManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Draft state for adding/editing
  const [draft, setDraft] = useState<Partial<Service>>({});

  const handleStartAdd = () => {
    setDraft({
      id: `srv-${Date.now()}`,
      title: "",
      description: "",
      price: "",
      deliveryTime: "",
      features: [],
      ctaText: "Inquire",
      ctaUrl: "",
      icon: "briefcase",
      visible: true,
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (service: Service, index: number) => {
    setDraft({
      ...service,
      id: service.id || `srv-${index}`,
      visible: service.visible !== false,
      features: service.features ? [...service.features] : [],
    });
    setEditingId(service.id || `srv-${index}`);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!draft.title?.trim()) return;

    const cleanService: Service = {
      id: draft.id || `srv-${Date.now()}`,
      title: draft.title.trim(),
      description: draft.description?.trim() || "",
      price: draft.price?.trim() || undefined,
      deliveryTime: draft.deliveryTime?.trim() || undefined,
      features: draft.features?.filter((f) => f.trim().length > 0),
      ctaText: draft.ctaText?.trim() || undefined,
      ctaUrl: draft.ctaUrl?.trim() || undefined,
      icon: draft.icon || "briefcase",
      visible: draft.visible !== false,
    };

    if (isAdding) {
      onChange([...services, cleanService]);
      setIsAdding(false);
    } else if (editingId) {
      onChange(
        services.map((s, idx) =>
          (s.id || `srv-${idx}`) === editingId ? cleanService : s
        )
      );
      setEditingId(null);
    }
    setDraft({});
  };

  const handleDelete = (index: number) => {
    onChange(services.filter((_, idx) => idx !== index));
    if (editingId) setEditingId(null);
  };

  const handleToggleVisibility = (index: number) => {
    onChange(
      services.map((s, idx) =>
        idx === index ? { ...s, visible: s.visible === false } : s
      )
    );
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const updated = [...services];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  const addFeature = () => {
    setDraft({
      ...draft,
      features: [...(draft.features || []), ""],
    });
  };

  const updateFeature = (index: number, val: string) => {
    const updated = [...(draft.features || [])];
    updated[index] = val;
    setDraft({ ...draft, features: updated });
  };

  const removeFeature = (index: number) => {
    setDraft({
      ...draft,
      features: (draft.features || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      {/* Existing list */}
      <div className="space-y-2.5">
        {services.map((service, index) => {
          const isItemEditing = (service.id || `srv-${index}`) === editingId;
          const isVisible = service.visible !== false;

          return (
            <div
              key={service.id || `${service.title}-${index}`}
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
                        disabled={index === services.length - 1}
                        title="Move Down"
                        className="p-1 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                          {service.title}
                        </h4>
                        {service.price && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {service.price}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-md">
                        {service.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(index)}
                      title={isVisible ? "Hide service" : "Show service"}
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
                      onClick={() => handleStartEdit(service, index)}
                      title="Edit Service"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      title="Delete Service"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-rose-600 text-xs cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Inline edit form */
                <ServiceEditorForm
                  draft={draft}
                  setDraft={setDraft}
                  onSave={handleSave}
                  onCancel={() => {
                    setEditingId(null);
                    setDraft({});
                  }}
                  addFeature={addFeature}
                  updateFeature={updateFeature}
                  removeFeature={removeFeature}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Section */}
      {isAdding ? (
        <div className="rounded-xl border border-slate-900 bg-slate-50/50 p-4 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
            Add New Service
          </h4>
          <ServiceEditorForm
            draft={draft}
            setDraft={setDraft}
            onSave={handleSave}
            onCancel={() => {
              setIsAdding(false);
              setDraft({});
            }}
            addFeature={addFeature}
            updateFeature={updateFeature}
            removeFeature={removeFeature}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={handleStartAdd}
          className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-slate-500 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service or Offering</span>
        </button>
      )}
    </div>
  );
}

interface EditorProps {
  draft: Partial<Service>;
  setDraft: React.Dispatch<React.SetStateAction<Partial<Service>>>;
  onSave: () => void;
  onCancel: () => void;
  addFeature: () => void;
  updateFeature: (idx: number, val: string) => void;
  removeFeature: (idx: number) => void;
}

function ServiceEditorForm({
  draft,
  setDraft,
  onSave,
  onCancel,
  addFeature,
  updateFeature,
  removeFeature,
}: EditorProps) {
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Service Title *
          </label>
          <input
            type="text"
            value={draft.title || ""}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="e.g. Cloud Architecture Strategy"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Price / Rate
          </label>
          <input
            type="text"
            value={draft.price || ""}
            onChange={(e) => setDraft({ ...draft, price: e.target.value })}
            placeholder="e.g. $150/hr or Starting at $3,500"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Delivery Time / Turnaround
          </label>
          <input
            type="text"
            value={draft.deliveryTime || ""}
            onChange={(e) => setDraft({ ...draft, deliveryTime: e.target.value })}
            placeholder="e.g. 2-3 Weeks or Ongoing"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            CTA Button URL (Optional)
          </label>
          <input
            type="url"
            value={draft.ctaUrl || ""}
            onChange={(e) => setDraft({ ...draft, ctaUrl: e.target.value })}
            placeholder="https://..."
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-700 uppercase">
          Description
        </label>
        <textarea
          rows={2}
          value={draft.description || ""}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="Detailed explanation of the deliverables, methodology, and outcome."
          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        />
      </div>

      {/* Feature Bullet Points */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Deliverable Checklist (Optional)
          </label>
          <button
            type="button"
            onClick={addFeature}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            + Add bullet point
          </button>
        </div>

        <div className="space-y-1.5">
          {draft.features?.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={feat}
                onChange={(e) => updateFeature(idx, e.target.value)}
                placeholder="e.g. Full source code & documentation"
                className="flex-1 text-xs px-2.5 py-1.5 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              />
              <button
                type="button"
                onClick={() => removeFeature(idx)}
                className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
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
          disabled={!draft.title?.trim()}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-lg cursor-pointer transition-colors"
        >
          Save Service
        </button>
      </div>
    </div>
  );
}
