"use client";

import React, { useState } from "react";
import { Education } from "@/types/profile";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  GraduationCap,
} from "lucide-react";
import { ImageUploadField } from "./ImageUploadField";

interface EducationManagerProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export function EducationManager({
  education,
  onChange,
}: EducationManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState<Partial<Education>>({});

  const handleStartAdd = () => {
    setDraft({
      id: `edu-${Date.now()}`,
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: "",
      logo: "",
      visible: true,
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (item: Education, index: number) => {
    setDraft({
      ...item,
      id: item.id || `edu-${index}`,
      visible: item.visible !== false,
    });
    setEditingId(item.id || `edu-${index}`);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!draft.school?.trim()) return;

    const cleanEducation: Education = {
      id: draft.id || `edu-${Date.now()}`,
      school: draft.school.trim(),
      degree: draft.degree?.trim() || undefined,
      fieldOfStudy: draft.fieldOfStudy?.trim() || undefined,
      startDate: draft.startDate?.trim() || undefined,
      endDate: draft.endDate?.trim() || undefined,
      description: draft.description?.trim() || undefined,
      logo: draft.logo || undefined,
      visible: draft.visible !== false,
    };

    if (isAdding) {
      onChange([...education, cleanEducation]);
      setIsAdding(false);
    } else if (editingId) {
      onChange(
        education.map((e, idx) =>
          (e.id || `edu-${idx}`) === editingId ? cleanEducation : e
        )
      );
      setEditingId(null);
    }
    setDraft({});
  };

  const handleDelete = (index: number) => {
    onChange(education.filter((_, idx) => idx !== index));
    if (editingId) setEditingId(null);
  };

  const handleToggleVisibility = (index: number) => {
    onChange(
      education.map((e, idx) =>
        idx === index ? { ...e, visible: e.visible === false } : e
      )
    );
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= education.length) return;

    const updated = [...education];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        {education.map((item, index) => {
          const isItemEditing = (item.id || `edu-${index}`) === editingId;
          const isVisible = item.visible !== false;

          return (
            <div
              key={item.id || `${item.school}-${index}`}
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
                        disabled={index === education.length - 1}
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
                          alt={item.school}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg border border-slate-200 shrink-0 bg-slate-100 flex items-center justify-center text-slate-500">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                    )}

                    <div className="min-w-0 space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                        {item.school}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        {[item.degree, item.fieldOfStudy]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {[item.startDate, item.endDate]
                          .filter(Boolean)
                          .join(" — ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(index)}
                      title={isVisible ? "Hide education" : "Show education"}
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
                      title="Edit Education"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      title="Delete Education"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-rose-600 text-xs cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <EducationEditorForm
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
            Add Education & Credentials
          </h4>
          <EducationEditorForm
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
          <span>Add Education / Degree</span>
        </button>
      )}
    </div>
  );
}

interface EducationEditorProps {
  draft: Partial<Education>;
  setDraft: React.Dispatch<React.SetStateAction<Partial<Education>>>;
  onSave: () => void;
  onCancel: () => void;
}

function EducationEditorForm({
  draft,
  setDraft,
  onSave,
  onCancel,
}: EducationEditorProps) {
  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-700 uppercase">
          School / University *
        </label>
        <input
          type="text"
          value={draft.school || ""}
          onChange={(e) => setDraft({ ...draft, school: e.target.value })}
          placeholder="e.g. UC Berkeley or Harvard Business School"
          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Degree / Certificate
          </label>
          <input
            type="text"
            value={draft.degree || ""}
            onChange={(e) => setDraft({ ...draft, degree: e.target.value })}
            placeholder="e.g. B.S. or Master of Science"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Field of Study
          </label>
          <input
            type="text"
            value={draft.fieldOfStudy || ""}
            onChange={(e) =>
              setDraft({ ...draft, fieldOfStudy: e.target.value })
            }
            placeholder="e.g. Computer Science or Economics"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Start Year
          </label>
          <input
            type="text"
            value={draft.startDate || ""}
            onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
            placeholder="e.g. 2017"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            End Year / Graduation
          </label>
          <input
            type="text"
            value={draft.endDate || ""}
            onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
            placeholder="e.g. 2021"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-700 uppercase">
          Activities / Honors / Notes
        </label>
        <textarea
          rows={2}
          value={draft.description || ""}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="Honors, thesis, leadership positions, or relevant coursework."
          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        />
      </div>

      <ImageUploadField
        label="University / Institution Logo (Optional)"
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
          disabled={!draft.school?.trim()}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-lg cursor-pointer transition-colors"
        >
          Save Education
        </button>
      </div>
    </div>
  );
}
