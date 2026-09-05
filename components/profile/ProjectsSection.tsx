import React from "react";
import { FolderGit2, ExternalLink } from "lucide-react";
import { Project } from "@/types/profile";
import { sanitizeUrl } from "@/lib/urls";
import { ProjectImage } from "./ProjectImage";

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

interface ProjectsSectionProps {
  projects?: Project[];
  showProjects?: boolean;
}

function ProjectCard({ project }: { project: Project }) {
  const projectUrl = project.url ? sanitizeUrl(project.url) : "";
  const githubUrl = project.github ? sanitizeUrl(project.github) : "";

  return (
    <div className="group overflow-hidden rounded-(--profile-radius) bg-(--profile-surface) border border-(--profile-border) hover:border-(--profile-primary)/40 transition-all duration-200 shadow-sm flex flex-col">
      {/* Project Thumbnail with graceful fallback */}
      <ProjectImage
        image={project.image}
        title={project.title}
        category={project.category}
      />

      {/* Project Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm sm:text-base font-bold text-(--profile-text) group-hover:text-(--profile-primary) transition-colors">
              {project.title}
            </h3>
            {project.status && (
              <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-(--profile-primary)/10 text-(--profile-primary) border border-(--profile-primary)/20">
                {project.status}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-(--profile-muted) leading-relaxed">
            {project.description}
          </p>

          {/* Tags */}
          {((project.tags && project.tags.length > 0) || (project.technologies && project.technologies.length > 0)) && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(project.tags || project.technologies || []).map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-(--profile-bg) text-(--profile-muted) border border-(--profile-border)"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Links */}
        {(projectUrl || githubUrl) && (
          <div className="pt-2 flex items-center gap-3 border-t border-(--profile-border)/60">
            {projectUrl && (
              <a
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--profile-primary) hover:underline"
                aria-label={`View ${project.title} project`}
              >
                <span>View Project</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--profile-muted) hover:text-(--profile-text) transition-colors ml-auto"
                aria-label={`View ${project.title} on GitHub`}
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Source</span>
              </a>
            )}
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

  const visibleProjects = projects.filter((p) => p.visible !== false);
  if (visibleProjects.length === 0) {
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
          {visibleProjects.length}
        </span>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-1">
        {visibleProjects.map((project, idx) => (
          <ProjectCard
            key={project.id || `${project.title}-${idx}`}
            project={project}
          />
        ))}
      </div>
    </section>
  );
}
