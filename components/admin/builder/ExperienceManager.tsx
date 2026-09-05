"use client";

import React, { useState } from "react";
import { Experience } from "@/types/profile";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Briefcase,
  Building2,
} from "lucide-react";
import { ImageUploadField } from "./ImageUploadField";

interface ExperienceManagerProps {
  experience: Experience[];
  onChange: (experience: Experience[]) => void;
}

export function ExperienceManager({
  experience,
  onChange,
}: ExperienceManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState<Partial<Experience>>({});

  const handleStartAdd = () => {
    setDraft({
      id: `exp-${Date.now()}`,
      title: "",
      company: "",
      employmentType: "Full-time",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      url: "",
      logo: "",
      visible: true,
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (item: Experience, index: number) => {
    setDraft({
      ...item,
      id: item.id || `exp-${index}`,
      visible: item.visible !== false,
      current: Boolean(item.current),
    });
    setEditingId(item.id || `exp-${index}`);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!draft.title?.trim() || !draft.company?.trim()) return;

    const cleanExperience: Experience = {
      id: draft.id || `exp-${Date.now()}`,
      title: draft.title.trim(),
      company: draft.company.trim(),
      employmentType: draft.employmentType?.trim() || undefined,
      location: draft.location?.trim() || undefined,
      startDate: draft.startDate?.trim() || undefined,
      endDate: draft.current ? undefined : draft.endDate?.trim() || undefined,
      current: Boolean(draft.current),
      description: draft.description?.trim() || undefined,
      url: draft.url?.trim() || undefined,
      logo: draft.logo || undefined,
      visible: draft.visible !== false,
    };

    if (isAdding) {
      onChange([...experience, cleanExperience]);
      setIsAdding(false);
    } else if (editingId) {
      onChange(
        experience.map((e, idx) =>
          (e.id || `exp-${idx}`) === editingId ? cleanExperience : e
        )
      );
      setEditingId(null);
    }
    setDraft({});
  };

  const handleDelete = (index: number) => {
    onChange(experience.filter((_, idx) => idx !== index));
    if (editingId) setEditingId(null);
  };

  const handleToggleVisibility = (index: number) => {
    onChange(
      experience.map((e, idx) =>
        idx === index ? { ...e, visible: e.visible === false } : e
      )
    );
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experience.length) return;

    const updated = [...experience];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        {experience.map((item, index) => {
          const isItemEditing = (item.id || `exp-${index}`) === editingId;
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
                        disabled={index === experience.length - 1}
                        title="Move Down"
                        className="p-1 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.logo ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                        <img
                          src={item.logo}
                          alt={item.company}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg border border-slate-200 shrink-0 bg-slate-100 flex items-center justify-center text-slate-500">
                        <Building2 className="w-5 h-5" />
                      </div>
                    )}

                    <div className="min-w-0 space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        {item.company}
                        {item.employmentType && ` • ${item.employmentType}`}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {[item.startDate, item.current ? "Present" : item.endDate]
                          .filter(Boolean)
                          .join(" — ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(index)}
                      title={isVisible ? "Hide experience" : "Show experience"}
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
                      title="Edit Experience"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      title="Delete Experience"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-rose-600 text-xs cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <ExperienceEditorForm
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
            Add Work Experience
          </h4>
          <ExperienceEditorForm
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
          <span>Add Work Experience</span>
        </button>
      )}
    </div>
  );
}

interface ExperienceEditorProps {
  draft: Partial<Experience>;
  setDraft: React.Dispatch<React.SetStateAction<Partial<Experience>>>;
  onSave: () => void;
  onCancel: () => void;
}

function ExperienceEditorForm({
  draft,
  setDraft,
  onSave,
  onCancel,
}: ExperienceEditorProps) {
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Job Title *
          </label>
          <input
            type="text"
            value={draft.title || ""}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="e.g. Principal Cloud Architect"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Company Name *
          </label>
          <input
            type="text"
            value={draft.company || ""}
            onChange={(e) => setDraft({ ...draft, company: e.target.value })}
            placeholder="e.g. Apex Cloud Solutions"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Employment Type
          </label>
          <select
            value={draft.employmentType || "Full-time"}
            onChange={(e) =>
              setDraft({ ...draft, employmentType: e.target.value })
            }
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
            <option value="Advisory">Advisory</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Location
          </label>
          <input
            type="text"
            value={draft.location || ""}
            onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            placeholder="e.g. San Francisco, CA (Hybrid)"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Start Date / Year
          </label>
          <input
            type="text"
            value={draft.startDate || ""}
            onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
            placeholder="e.g. Jan 2022 or 2022"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            End Date / Year
          </label>
          <input
            type="text"
            disabled={Boolean(draft.current)}
            value={draft.current ? "Present" : draft.endDate || ""}
            onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
            placeholder="e.g. Dec 2024 or 2024"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white disabled:bg-slate-100 disabled:text-slate-400"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={Boolean(draft.current)}
          onChange={(e) => setDraft({ ...draft, current: e.target.checked })}
          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
        />
        <span className="text-xs text-slate-800 font-medium">
          I currently work here
        </span>
      </label>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-700 uppercase">
          Role Summary & Impact
        </label>
        <textarea
          rows={2}
          value={draft.description || ""}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="Key achievements, initiatives, systems built, or team leadership."
          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        />
      </div>

      <ImageUploadField
        label="Company Logo (Optional)"
        value={draft.logo || ""}
        onChange={(url) => setDraft({ ...draft, logo: url })}
        folder="logos"
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
          disabled={!draft.title?.trim() || !draft.company?.trim()}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-lg cursor-pointer transition-colors"
        >
          Save Experience
        </button>
      </div>
    </div>
  );
}
