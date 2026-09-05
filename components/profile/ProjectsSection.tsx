import React from "react";
import { FolderGit2, ExternalLink } from "lucide-react";
import { Project } from "@/types/profile";
import { sanitizeUrl } from "@/lib/urls";
import { ProjectImage } from "./ProjectImage";

interface ProjectsSectionProps {
  projects?: Project[];
  showProjects?: boolean;
}

function ProjectCard({ project }: { project: Project }) {
  const projectUrl = project.url ? sanitizeUrl(project.url) : "";

  return (
    <div className="group overflow-hidden rounded-(--profile-radius) bg-(--profile-surface) border border-(--profile-border) hover:border-(--profile-primary)/40 transition-all duration-200 shadow-sm flex flex-col">
      {/* Project Thumbnail with graceful client-side fallback */}
      <ProjectImage
        image={project.image}
        title={project.title}
        category={project.category}
      />

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

/**
 * ProjectsSection (Server Component)
 */
export function ProjectsSection({
  projects,
  showProjects = true,
}: ProjectsSectionProps) {
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
