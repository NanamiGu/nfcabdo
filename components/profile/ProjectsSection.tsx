"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FolderGit2, ExternalLink } from "lucide-react";
import { Project } from "@/types/profile";
import { sanitizeUrl } from "@/lib/urls";

interface ProjectsSectionProps {
  projects?: Project[];
  showProjects?: boolean;
}

function ProjectCard({ project }: { project: Project }) {
  const [imageError, setImageError] = useState(false);
  const projectUrl = project.url ? sanitizeUrl(project.url) : "";

  return (
    <div className="group overflow-hidden rounded-(--profile-radius) bg-(--profile-surface) border border-(--profile-border) hover:border-(--profile-primary)/40 transition-all duration-200 shadow-sm flex flex-col">
      {/* Project Thumbnail */}
      {project.image && !imageError ? (
        <div className="relative w-full aspect-video overflow-hidden bg-black/40">
          <Image
            src={project.image}
            alt={project.title}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          {project.category && (
            <div className="absolute top-2.5 left-2.5">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-black/70 backdrop-blur-md text-white border border-white/10">
                {project.category}
              </span>
            </div>
          )}
        </div>
      ) : (
        project.category && (
          <div className="pt-4 px-4">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-(--profile-primary)/10 text-(--profile-primary) border border-(--profile-primary)/20">
              {project.category}
            </span>
          </div>
        )
      )}

      {/* Project Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1.5">
          <h3 className="text-sm sm:text-base font-bold text-(--profile-text) group-hover:text-(--profile-primary) transition-colors">
            {project.title}
          </h3>
          <p className="text-xs sm:text-sm text-(--profile-muted) leading-relaxed">
            {project.description}
          </p>
        </div>

        {projectUrl && (
          <div className="pt-2">
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--profile-primary) hover:underline"
              aria-label={`View ${project.title} case study (opens in new tab)`}
            >
              <span>View Case Study</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectsSection({ projects, showProjects = true }: ProjectsSectionProps) {
  if (!showProjects || !projects || projects.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="projects-heading" className="w-full space-y-3.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-(--profile-primary)" />
          <h2
            id="projects-heading"
            className="text-sm font-bold tracking-wider uppercase text-(--profile-muted)"
          >
            Featured Work
          </h2>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-(--profile-surface) text-(--profile-muted) border border-(--profile-border)">
          {projects.length}
        </span>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-1">
        {projects.map((project, idx) => (
          <ProjectCard key={`${project.title}-${idx}`} project={project} />
        ))}
      </div>
    </section>
  );
}
