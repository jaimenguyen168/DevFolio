import React from "react";
import ProjectsView from "@/modules/projects/ui/views/projects-view";

interface ProjectsPageProps {
  params: Promise<{ username: string }>;
}

const ProjectsPage = async ({ params }: ProjectsPageProps) => {
  const { username } = await params;

  if (!username) {
    return null;
  }

  return <ProjectsView username={username} />;
};
export default ProjectsPage;
