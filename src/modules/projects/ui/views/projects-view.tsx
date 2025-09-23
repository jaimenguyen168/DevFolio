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

interface ProjectsViewProps {
  username: string;
}

const ProjectsView = ({ username }: ProjectsViewProps) => {
  const user = useQuery(api.functions.users.getUser, {
    username: username,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [availableTechs, setAvailableTechs] = useState<string[]>([]);

  const projects = [
    {
      id: 1,
      title: "ui-animations",
      subtitle: "ui-animations",
      description: "Duis aute irure dolor in velit esse cillum dolore.",
      image:
        "https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      technologies: ["React", "TypeScript", "Tailwind"],
      githubUrl: "https://github.com/jaimenguyen168/NextJS-Learnify",
    },
    {
      id: 2,
      title: "tetris-game",
      subtitle: "tetris-game",
      description: "Duis aute irure dolor in velit esse cillum dolore.",
      image:
        "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      technologies: ["Vue", "JavaScript", "CSS", "Swift"],
      githubUrl: "https://github.com/vkurko/calendar",
    },
    {
      id: 3,
      title: "nimbus",
      subtitle: "nimbus",
      description: "Duis aute irure dolor in velit esse cillum dolore.",
      image:
        "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      technologies: ["Flutter", "Dart"],
      githubUrl: "https://github.com/jaimenguyen168/NextJS-Learnify",
    },
    {
      id: 4,
      title: "weather-app",
      subtitle: "weather-app",
      description: "A beautiful weather application with real-time data.",
      image:
        "https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=2610&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      technologies: ["Next.js", "TypeScript", "Node.js"],
    },
  ];

  useEffect(() => {
    const uniqueTechs = getUniqueTechnologies(projects);
    setAvailableTechs(uniqueTechs);
    setSelectedTechs(uniqueTechs);
  }, []);

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

  const filteredProjects = projects.filter((project) =>
    project.technologies.some((tech) => selectedTechs.includes(tech)),
  );

  const isEmpty = filteredProjects.length === 0;

  const handleViewProject = (projectId: number) => {
    console.log(`Viewing project ${projectId}`);
  };

  if (user === undefined) {
    return null;
  }

  if (!user) {
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

            {isEmpty ? (
              <>
                <Separator className="bg-gray-700" />
                <button
                  onClick={handleSelectAll}
                  className="flex items-center justify-start w-full space-x-6 text-gray-400"
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
                >
                  <Trash2 size={16} />
                  <span>Clear all</span>
                </button>
              </>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <div className="flex flex-col sm:flex-row h-full relative w-full">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md z-40 sm:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Left Sidebar - Desktop: Fixed, Mobile: Overlay */}
      <div
        className={`
        ${/* Desktop styles */ ""}
        sm:w-[300px] sm:border-r sm:border-gray-700 sm:flex sm:flex-col sm:h-full sm:relative sm:transform-none sm:transition-none
        ${/* Mobile styles */ ""}
        fixed top-0 left-0 h-full w-[280px] bg-slate-900 border-r border-gray-700 flex flex-col z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
      `}
      >
        {/* Mobile Close Button */}
        <div className="sm:hidden flex items-center justify-between p-4 border-b border-gray-700">
          <span className="text-white font-medium">_projects</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-gray-400 hover:bg-gray-700 hover:text-white p-1"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 w-full">
        {/* Tab Header */}
        <div className="items-center border-b border-gray-700 sticky top-0 bg-slate-900 z-10">
          <div
            className={`px-4 py-3 flex items-center w-full sm:w-fit justify-between md:justify-start gap-3 ${!isEmpty ? "sm:border-r sm:border-gray-700" : ""}`}
          >
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="sm:hidden text-gray-400 hover:bg-gray-700 hover:text-white p-1 mr-3"
              >
                <PanelRight size={20} />
              </Button>
              {selectedTechs.length === availableTechs.length ? (
                <span className="text-gray-400 text-sm">all stack</span>
              ) : (
                <span className="text-gray-400 text-sm">
                  {selectedTechs.length > 3
                    ? `${selectedTechs.slice(0, 3).join(", ")}...`
                    : selectedTechs.join(", ")}
                </span>
              )}
            </div>

            {!isEmpty ? (
              <button className="text-gray-500 hover:text-white cursor-pointer">
                ×
              </button>
            ) : (
              <div className="flex-1 w-full h-6" />
            )}
          </div>
        </div>

        {/* Projects Grid or Empty State */}
        {isEmpty ? (
          <div className="flex-1 flex justify-center items-center w-full flex-shrink-0">
            <p className="text-gray-500 text-lg px-6 text-center">
              No projects found for selected technologies
            </p>
          </div>
        ) : (
          <div className="flex-1 px-12 pt-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-x-12 gap-y-6">
              <AnimatePresence>
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onViewProject={() => handleViewProject(project.id)}
                    delay={index}
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
