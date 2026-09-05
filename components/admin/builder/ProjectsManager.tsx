"use client";

import React, { useState } from "react";
import { Project } from "@/types/profile";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  FolderGit2,
} from "lucide-react";
import { ImageUploadField } from "./ImageUploadField";

interface ProjectsManagerProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export function ProjectsManager({ projects, onChange }: ProjectsManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState<Partial<Project>>({});
  const [techInput, setTechInput] = useState("");

  const handleStartAdd = () => {
    setDraft({
      id: `proj-${Date.now()}`,
      title: "",
      description: "",
      technologies: [],
      status: "Live",
      url: "",
      githubUrl: "",
      image: "",
      visible: true,
    });
    setTechInput("");
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (project: Project, index: number) => {
    setDraft({
      ...project,
      id: project.id || `proj-${index}`,
      visible: project.visible !== false,
      technologies: project.technologies || project.tags || [],
    });
    setTechInput("");
    setEditingId(project.id || `proj-${index}`);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!draft.title?.trim()) return;

    const cleanProject: Project = {
      id: draft.id || `proj-${Date.now()}`,
      title: draft.title.trim(),
      description: draft.description?.trim() || "",
      url: draft.url?.trim() || undefined,
      githubUrl: draft.githubUrl?.trim() || undefined,
      status: draft.status?.trim() || undefined,
      technologies: draft.technologies || [],
      tags: draft.technologies || [],
      image: draft.image || undefined,
      visible: draft.visible !== false,
    };

    if (isAdding) {
      onChange([...projects, cleanProject]);
      setIsAdding(false);
    } else if (editingId) {
      onChange(
        projects.map((p, idx) =>
          (p.id || `proj-${idx}`) === editingId ? cleanProject : p
        )
      );
      setEditingId(null);
    }
    setDraft({});
  };

  const handleDelete = (index: number) => {
    onChange(projects.filter((_, idx) => idx !== index));
    if (editingId) setEditingId(null);
  };

  const handleToggleVisibility = (index: number) => {
    onChange(
      projects.map((p, idx) =>
        idx === index ? { ...p, visible: p.visible === false } : p
      )
    );
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  const addTechnology = () => {
    if (!techInput.trim()) return;
    setDraft({
      ...draft,
      technologies: [...(draft.technologies || []), techInput.trim()],
    });
    setTechInput("");
  };

  const removeTechnology = (index: number) => {
    setDraft({
      ...draft,
      technologies: (draft.technologies || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      {/* Existing list */}
      <div className="space-y-2.5">
        {projects.map((project, index) => {
          const isItemEditing = (project.id || `proj-${index}`) === editingId;
          const isVisible = project.visible !== false;

          return (
            <div
              key={project.id || `${project.title}-${index}`}
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
                        disabled={index === projects.length - 1}
                        title="Move Down"
                        className="p-1 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {project.image && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                          {project.title}
                        </h4>
                        {project.status && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {project.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-md">
                        {project.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(index)}
                      title={isVisible ? "Hide project" : "Show project"}
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
                      onClick={() => handleStartEdit(project, index)}
                      title="Edit Project"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      title="Delete Project"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-rose-600 text-xs cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Inline edit form */
                <ProjectEditorForm
                  draft={draft}
                  setDraft={setDraft}
                  techInput={techInput}
                  setTechInput={setTechInput}
                  addTechnology={addTechnology}
                  removeTechnology={removeTechnology}
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

      {/* Add New Section */}
      {isAdding ? (
        <div className="rounded-xl border border-slate-900 bg-slate-50/50 p-4 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
            Add Featured Project
          </h4>
          <ProjectEditorForm
            draft={draft}
            setDraft={setDraft}
            techInput={techInput}
            setTechInput={setTechInput}
            addTechnology={addTechnology}
            removeTechnology={removeTechnology}
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
          <span>Add Project or Portfolio Piece</span>
        </button>
      )}
    </div>
  );
}

interface ProjectEditorProps {
  draft: Partial<Project>;
  setDraft: React.Dispatch<React.SetStateAction<Partial<Project>>>;
  techInput: string;
  setTechInput: (val: string) => void;
  addTechnology: () => void;
  removeTechnology: (idx: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

function ProjectEditorForm({
  draft,
  setDraft,
  techInput,
  setTechInput,
  addTechnology,
  removeTechnology,
  onSave,
  onCancel,
}: ProjectEditorProps) {
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Project Title *
          </label>
          <input
            type="text"
            value={draft.title || ""}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="e.g. NextGen Microservices Platform"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Status Badge
          </label>
          <input
            type="text"
            value={draft.status || ""}
            onChange={(e) => setDraft({ ...draft, status: e.target.value })}
            placeholder="e.g. Live, Case Study, or In Progress"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Live URL / Case Study
          </label>
          <input
            type="url"
            value={draft.url || ""}
            onChange={(e) => setDraft({ ...draft, url: e.target.value })}
            placeholder="https://..."
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            GitHub / Code Repository
          </label>
          <input
            type="url"
            value={draft.githubUrl || ""}
            onChange={(e) => setDraft({ ...draft, githubUrl: e.target.value })}
            placeholder="https://github.com/..."
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
          placeholder="Brief description of the problem solved, tech architecture, and metrics achieved."
          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        />
      </div>

      {/* Technologies tags */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-700 uppercase">
          Tech Stack & Tags
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTechnology();
              }
            }}
            placeholder="e.g. Next.js, Go, PostgreSQL (press Enter)"
            className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
          />
          <button
            type="button"
            onClick={addTechnology}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            Add Tag
          </button>
        </div>

        {draft.technologies && draft.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {draft.technologies.map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-800 border border-slate-200"
              >
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => removeTechnology(i)}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image Upload */}
      <ImageUploadField
        label="Project Screenshot or Banner"
        value={draft.image || ""}
        onChange={(url) => setDraft({ ...draft, image: url })}
        folder="projects"
        aspectRatio="wide"
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
          disabled={!draft.title?.trim()}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-lg cursor-pointer transition-colors"
        >
          Save Project
        </button>
      </div>
    </div>
  );
}
