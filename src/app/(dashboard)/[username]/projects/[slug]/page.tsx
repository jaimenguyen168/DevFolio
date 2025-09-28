import React from "react";
import ProjectDetailsView from "@/modules/projects/ui/views/project-details-view";

interface ProjectDetailsPageProps {
  params: Promise<{ slug: string; username: string }>;
}

const ProjectDetailsPage = async ({ params }: ProjectDetailsPageProps) => {
  const { slug, username } = await params;

  return <ProjectDetailsView slug={slug} username={username} />;
};
export default ProjectDetailsPage;
