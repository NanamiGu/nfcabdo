"use client";

import React, { useState } from "react";
import { Testimonial } from "@/types/profile";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Star,
} from "lucide-react";
import { ImageUploadField } from "./ImageUploadField";

interface TestimonialsManagerProps {
  testimonials: Testimonial[];
  onChange: (testimonials: Testimonial[]) => void;
}

export function TestimonialsManager({
  testimonials,
  onChange,
}: TestimonialsManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState<Partial<Testimonial>>({});

  const handleStartAdd = () => {
    setDraft({
      id: `test-${Date.now()}`,
      name: "",
      role: "",
      company: "",
      content: "",
      rating: 5,
      avatar: "",
      visible: true,
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (testimonial: Testimonial, index: number) => {
    setDraft({
      ...testimonial,
      id: testimonial.id || `test-${index}`,
      content: testimonial.content || testimonial.text || testimonial.quote || "",
      rating: testimonial.rating || 5,
      visible: testimonial.visible !== false,
    });
    setEditingId(testimonial.id || `test-${index}`);
    setIsAdding(false);
  };

  const handleSave = () => {
    const quoteText = draft.content?.trim();
    if (!draft.name?.trim() || !quoteText) return;

    const cleanTestimonial: Testimonial = {
      id: draft.id || `test-${Date.now()}`,
      name: draft.name.trim(),
      author: draft.name.trim(),
      role: draft.role?.trim() || undefined,
      company: draft.company?.trim() || undefined,
      content: quoteText,
      text: quoteText,
      quote: quoteText,
      rating: draft.rating || 5,
      avatar: draft.avatar || undefined,
      visible: draft.visible !== false,
    };

    if (isAdding) {
      onChange([...testimonials, cleanTestimonial]);
      setIsAdding(false);
    } else if (editingId) {
      onChange(
        testimonials.map((t, idx) =>
          (t.id || `test-${idx}`) === editingId ? cleanTestimonial : t
        )
      );
      setEditingId(null);
    }
    setDraft({});
  };

  const handleDelete = (index: number) => {
    onChange(testimonials.filter((_, idx) => idx !== index));
    if (editingId) setEditingId(null);
  };

  const handleToggleVisibility = (index: number) => {
    onChange(
      testimonials.map((t, idx) =>
        idx === index ? { ...t, visible: t.visible === false } : t
      )
    );
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    const updated = [...testimonials];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        {testimonials.map((t, index) => {
          const isItemEditing = (t.id || `test-${index}`) === editingId;
          const isVisible = t.visible !== false;
          const authorName = t.name || t.author || "Client";
          const quote = t.content || t.text || t.quote || "";

          return (
            <div
              key={t.id || `${authorName}-${index}`}
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
                        disabled={index === testimonials.length - 1}
                        title="Move Down"
                        className="p-1 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {t.avatar && (
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                        <img
                          src={t.avatar}
                          alt={authorName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                          {authorName}
                        </h4>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: t.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 italic truncate max-w-md">
                        &ldquo;{quote}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(index)}
                      title={isVisible ? "Hide testimonial" : "Show testimonial"}
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
                      onClick={() => handleStartEdit(t, index)}
                      title="Edit Testimonial"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      title="Delete Testimonial"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-rose-600 text-xs cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <TestimonialEditorForm
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
            Add Client Endorsement
          </h4>
          <TestimonialEditorForm
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
          <span>Add Testimonial or Endorsement</span>
        </button>
      )}
    </div>
  );
}

interface TestimonialEditorProps {
  draft: Partial<Testimonial>;
  setDraft: React.Dispatch<React.SetStateAction<Partial<Testimonial>>>;
  onSave: () => void;
  onCancel: () => void;
}

function TestimonialEditorForm({
  draft,
  setDraft,
  onSave,
  onCancel,
}: TestimonialEditorProps) {
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Client Name *
          </label>
          <input
            type="text"
            value={draft.name || ""}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="e.g. Sarah Jenkins"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Role / Job Title
          </label>
          <input
            type="text"
            value={draft.role || ""}
            onChange={(e) => setDraft({ ...draft, role: e.target.value })}
            placeholder="e.g. VP of Engineering"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Company Name
          </label>
          <input
            type="text"
            value={draft.company || ""}
            onChange={(e) => setDraft({ ...draft, company: e.target.value })}
            placeholder="e.g. Acme Global"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-700 uppercase">
          Star Rating (1 to 5)
        </label>
        <div className="flex items-center gap-1 text-amber-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setDraft({ ...draft, rating: star })}
              className="p-1 hover:scale-110 transition-transform cursor-pointer"
            >
              <Star
                className={`w-5 h-5 ${
                  star <= (draft.rating || 5)
                    ? "fill-current"
                    : "text-slate-300 stroke-current fill-none"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-700 uppercase">
          Quote / Feedback *
        </label>
        <textarea
          rows={2}
          value={draft.content || ""}
          onChange={(e) => setDraft({ ...draft, content: e.target.value })}
          placeholder="Client's review, endorsement, or feedback."
          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        />
      </div>

      <ImageUploadField
        label="Client Avatar Photo (Optional)"
        value={draft.avatar || ""}
        onChange={(url) => setDraft({ ...draft, avatar: url })}
        folder="avatars"
        aspectRatio="square"
      />

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
          disabled={!draft.name?.trim() || !draft.content?.trim()}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-lg cursor-pointer transition-colors"
        >
          Save Testimonial
        </button>
      </div>
    </div>
  );
}
