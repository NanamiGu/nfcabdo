"use client";

import React, { useState } from "react";
import { SkillItem } from "@/types/profile";
import { Plus, X, Eye, EyeOff } from "lucide-react";

interface SkillsManagerProps {
  skills: SkillItem[];
  onChange: (skills: SkillItem[]) => void;
}

export function SkillsManager({ skills, onChange }: SkillsManagerProps) {
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState<string>("Advanced");

  const handleAdd = () => {
    if (!skillName.trim()) return;

    const newSkill: SkillItem = {
      id: `sk-${Date.now()}`,
      name: skillName.trim(),
      level: skillLevel,
      visible: true,
    };

    onChange([...skills, newSkill]);
    setSkillName("");
  };

  const handleRemove = (index: number) => {
    onChange(skills.filter((_, idx) => idx !== index));
  };

  const handleToggleVisibility = (index: number) => {
    onChange(
      skills.map((s, idx) =>
        idx === index ? { ...s, visible: s.visible === false } : s
      )
    );
  };

  return (
    <div className="space-y-3.5">
      {/* Input bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Skill name (e.g. Next.js, Cloud Architecture, Python)"
          className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        />

        <select
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value)}
          className="text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white sm:w-36"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!skillName.trim()}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Skills list as interactive badges */}
      <div className="flex flex-wrap gap-2 pt-1">
        {skills.map((skill, index) => {
          const isVisible = skill.visible !== false;

          return (
            <span
              key={skill.id || `${skill.name}-${index}`}
              className={`inline-flex items-center gap-2 pl-3 pr-2 py-1 rounded-full text-xs font-medium border transition-all ${
                isVisible
                  ? "bg-slate-50 text-slate-800 border-slate-200"
                  : "bg-slate-100 text-slate-400 border-slate-200 line-through opacity-60"
              }`}
            >
              <span>{skill.name}</span>
              {skill.level && (
                <span className="text-[10px] text-slate-400 font-normal">
                  ({skill.level})
                </span>
              )}

              <button
                type="button"
                onClick={() => handleToggleVisibility(index)}
                title={isVisible ? "Hide skill" : "Show skill"}
                className="hover:text-slate-900 text-slate-400 cursor-pointer"
              >
                {isVisible ? (
                  <Eye className="w-3 h-3" />
                ) : (
                  <EyeOff className="w-3 h-3" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleRemove(index)}
                title="Remove skill"
                className="hover:text-rose-600 text-slate-400 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
