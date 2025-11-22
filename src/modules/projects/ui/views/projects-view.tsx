"use client";

import React, { useState, useEffect } from "react";
import {
  Folder,
  X,
  PanelRight,
  CheckSquare,
  Square,
  Trash2,
  Layers,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  getTechInfo,
  getUniqueTechnologies,
} from "@/modules/projects/lib/techStacks";
import ProjectCard from "@/modules/projects/ui/components/ProjectCard";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence } from "motion/react";
import { api } from "../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import NotFoundView from "@/modules/auth/ui/views/not-found-view";
import Loading from "@/components/Loading";

interface ProjectsViewProps {
  username: string;
}

const ProjectsView = ({ username }: ProjectsViewProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [availableTechs, setAvailableTechs] = useState<string[]>([]);

  const projects = useQuery(api.functions.projects.getProjects, {
    username: username,
  });

  useEffect(() => {
    if (projects) {
      const uniqueTechs = getUniqueTechnologies(projects);
      setAvailableTechs(uniqueTechs);
      setSelectedTechs(uniqueTechs);
    }
  }, [projects]);

  const handleClearAll = () => {
    setSelectedTechs([]);
  };

  const handleSelectAll = () => {
    setSelectedTechs(availableTechs);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const selectTech = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech],
    );
  };

  const filteredProjects = projects?.filter((project) =>
    project.techStack?.some((tech) => selectedTechs.includes(tech)),
  );

  const isEmpty = projects?.length === 0;
  const isCleared = filteredProjects?.length === 0;

  if (projects === undefined) {
    return <Loading />;
  }

  if (!projects) {
    return <NotFoundView />;
  }

  const SidebarContent = () => (
    <Accordion type="multiple" defaultValue={["projects"]} className="w-full">
      {/* Projects Section */}
      <AccordionItem value="projects" className="border-gray-700">
        <AccordionTrigger className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors hover:no-underline py-3.5 border-b border-gray-700 rounded-none px-4">
          <div className="flex items-center">
            <Folder size={16} className="mr-2" /> _tech-stack
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-3">
          <div className="mt-2 space-y-5 mx-4">
            {availableTechs.map((tech) => {
              const techInfo = getTechInfo(tech);
              const isSelected = selectedTechs.includes(tech);

              return (
                <button
                  key={tech}
                  onClick={() => selectTech(tech)}
                  className={`flex  items-center justify-start w-full group transition-colors hover:bg-transparent space-x-6 ${
                    isSelected
                      ? "text-orange-400"
                      : "text-gray-400 hover:text-orange-300"
                  }`}
                  aria-label="Select technology"
                >
                  {isSelected ? (
                    <CheckSquare size={16} />
                  ) : (
                    <Square size={16} />
                  )}
                  <div className="flex items-center space-x-3">
                    <techInfo.icon size={20} />
                    <span
                      className={`text-sm font-medium group-hover:text-orange-300 ${isSelected ? "text-orange-400" : "text-white"}`}
                    >
                      {tech}
                    </span>
                  </div>
                </button>
              );
            })}

            {!isEmpty &&
              (isCleared ? (
                <>
                  <Separator className="bg-gray-700" />
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center justify-start w-full space-x-6 text-gray-400"
                    aria-label="Select all"
                  >
                    <Layers size={16} />
                    <span>Select all</span>
                  </button>
                </>
              ) : (
                <>
                  <Separator className="bg-gray-700" />
                  <button
                    onClick={handleClearAll}
                    className="flex items-center justify-start w-full space-x-6 text-gray-400"
                    aria-label="Clear all"
                  >
                    <Trash2 size={16} />
                    <span>Clear all</span>
                  </button>
                </>
              ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <div className="flex flex-col md:flex-row h-full relative w-full">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Left Sidebar - Desktop: Fixed, Mobile: Overlay */}
      <div
        className={`
        ${/* Desktop styles */ ""}
        md:w-[360px] md:border-r md:border-gray-700 md:flex md:flex-col md:h-full md:relative md:transform-none md:transition-none
        ${/* Mobile styles */ ""}
        fixed top-0 left-0 h-full w-[360px] bg-slate-900 border-r border-gray-700 flex flex-col z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Mobile Close Button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-700">
          <span className="text-white font-medium">_projects</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-gray-400 hover:bg-gray-700 hover:text-white p-1"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full w-full">
        {/* Tab Header */}
        {!isEmpty && !isCleared && (
          <div className="items-center border-b border-gray-700 sticky top-0 bg-slate-900 z-10">
            <div
              className={`px-4 py-3 flex items-center w-full md:w-fit justify-between md:justify-start gap-3 ${!isCleared ? "md:border-r md:border-gray-700" : ""}`}
            >
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="sm:hidden text-gray-400 hover:bg-gray-700 hover:text-white p-1 mr-3"
                  aria-label="Toggle sidebar"
                >
                  <PanelRight size={20} />
                </Button>
                {selectedTechs.length === availableTechs.length ? (
                  <span className="text-gray-400 text-sm">_all-stacks</span>
                ) : (
                  <span className="text-gray-400 text-sm">
                    {selectedTechs.length > 3
                      ? `${selectedTechs.slice(0, 3).join(", ")}...`
                      : selectedTechs.join(", ")}
                  </span>
                )}
              </div>

              <button
                onClick={handleClearAll}
                className="text-gray-500 hover:text-white cursor-pointer"
                aria-label="Clear all"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Projects Grid or Empty State */}
        {isEmpty ? (
          <div className="flex-1 flex justify-center items-center w-full flex-shrink-0">
            <p className="text-gray-500 text-lg px-6 text-center">
              No projects found
            </p>
          </div>
        ) : isCleared ? (
          <div className="flex-1 flex justify-center items-center w-full flex-shrink-0">
            <p className="text-gray-500 text-lg px-6 text-center">
              No projects found for selected technologies
            </p>
          </div>
        ) : (
          <div className="flex-1 px-4 lg:px-12 py-6 overflow-y-auto ">
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 max-w-7xl mx-auto ">
              <AnimatePresence>
                {filteredProjects?.map((project, index) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    username={username}
                    delay={index}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsView;
