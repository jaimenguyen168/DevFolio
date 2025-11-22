"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { ExternalLink, ArrowRight, Code2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTechInfo } from "@/modules/projects/lib/techStacks";
import { SiGithub } from "react-icons/si";
import { Project } from "@/modules/types";
import Image from "next/image";
import Link from "next/link";

interface ProjectsShowcaseProps {
  projects: Project[];
  username: string;
}

const ProjectsShowcase = ({ projects, username }: ProjectsShowcaseProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const featuredProjects = projects.slice(0, 6);

  const handleProjectClick = (slug: string) => {
    window.location.href = `/${username}/projects/${slug}`;
  };

  // Dynamic grid class based on number of projects
  const getGridClass = (projectCount: number) => {
    if (projectCount === 1) {
      return "grid grid-cols-1 lg:grid-cols-1 gap-4 mb-6 relative z-10";
    } else if (projectCount === 2) {
      return "grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 relative z-10";
    } else {
      return "grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 relative z-10";
    }
  };

  if (featuredProjects.length === 0) {
    return (
      <div className="flex-1 w-full">
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 h-[570px] flex items-center justify-center">
          <div className="text-center">
            <Code2 className="mx-auto mb-4 text-slate-500" size={48} />
            <h3 className="text-lg md:text-xl font-semibold text-slate-300 mb-2">
              No Projects Yet
            </h3>
            <p className="text-sm md:text-base text-slate-500">
              Projects will appear here once they're added to the portfolio.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full">
      <div className="bg-gradient-to-br from-slate-800/20 to-slate-900/40 backdrop-blur-sm border border-slate-700/30 rounded-xl p-4 lg:p-8 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-xl" />

        {/* Header */}
        <div className="text-center mb-6 lg:mb-8 relative z-10">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2">
            Featured Projects
          </h2>
        </div>

        {/* Projects Grid - Dynamic layout based on project count */}
        <div className={getGridClass(featuredProjects.length)}>
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleProjectClick(project.slug)}
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10">
                {/* Image Section */}
                <div className="relative h-48 bg-gradient-to-tr from-slate-700 to-slate-800 overflow-hidden">
                  {project.imageUrls?.[0] ? (
                    <Image
                      src={project.imageUrls[0]}
                      alt={project.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center">
                      <span className="text-gray-400 font-medium text-sm md:text-lg">
                        {project.name}
                      </span>
                    </div>
                  )}

                  {/* Enhanced Overlay gradient for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Status Badge */}
                  {project.status && (
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${
                          project.status === "completed"
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : project.status === "in-progress"
                              ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                              : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  )}

                  {/* Tech Stack Icons */}
                  <div className="absolute top-3 right-3 flex items-center space-x-2">
                    {(project.techStack || [])
                      .slice(0, 3)
                      .map((tech, techIndex) => {
                        const techInfo = getTechInfo(tech);
                        const IconComponent = techInfo.icon;
                        return (
                          <div
                            key={techIndex}
                            className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                            title={tech}
                          >
                            <IconComponent size={14} />
                          </div>
                        );
                      })}
                    {project.techStack && project.techStack.length > 3 && (
                      <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg text-xs font-semibold text-slate-900">
                        +{project.techStack.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Project Links */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {project.githubUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-7 h-7 md:w-8 md:h-8 p-0 bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 border border-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.githubUrl, "_blank");
                        }}
                        title="View Source"
                      >
                        <SiGithub size={12} className="md:hidden" />
                        <SiGithub size={14} className="hidden md:block" />
                      </Button>
                    )}
                    {project.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-7 h-7 md:w-8 md:h-8 p-0 bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 border border-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.url, "_blank");
                        }}
                        title="Live Demo"
                      >
                        <ExternalLink size={12} className="md:hidden" />
                        <ExternalLink size={14} className="hidden md:block" />
                      </Button>
                    )}
                  </div>

                  {/* Title Overlay with enhanced text shadow */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <h3 className="text-base md:text-lg font-bold text-white mb-1 drop-shadow-2xl [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%)]">
                      {project.name}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-100 line-clamp-2 drop-shadow-lg [text-shadow:_0_1px_4px_rgb(0_0_0_/_70%)]">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Content Section - Simplified without features */}
                <div className="p-3 md:p-4">
                  {/* View Project Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-orange-500/10 hover:border-orange-500/50 hover:text-orange-300 transition-all duration-200 text-xs md:text-sm"
                  >
                    View Project
                    <ArrowRight size={12} className="ml-2 md:hidden" />
                    <ArrowRight size={14} className="ml-2 hidden md:block" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Link */}
        <div className="text-center relative z-10">
          <Link href={`/${username}/projects/`} aria-label="View All Projects">
            <Button
              className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 border border-orange-500/40 text-white px-4 md:px-6 py-2 rounded-lg transition-all duration-300 group text-xs md:text-sm"
              aria-label="View All Projects"
            >
              <span>View All Projects</span>
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                size={14}
              />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectsShowcase;
