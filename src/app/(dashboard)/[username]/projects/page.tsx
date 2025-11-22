import React from "react";
import ProjectsView from "@/modules/projects/ui/views/projects-view";
import { Metadata } from "next";
import { generatePageMetadata } from "@/constants/metadata";

interface ProjectsPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { username } = await params;
  return generatePageMetadata(username, "projects");
}

const ProjectsPage = async ({ params }: ProjectsPageProps) => {
  const { username } = await params;

  if (!username) {
    return null;
  }

  return <ProjectsView username={username} />;
};
export default ProjectsPage;
