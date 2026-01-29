"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import ProjectsShowcase from "@/modules/home/ui/components/ProjectsShowcase";
import NotFoundView from "@/modules/auth/ui/views/not-found-view";
import Loading from "@/components/Loading";
import TechStackCloud from "@/modules/home/ui/components/TechStackCloud";
import IntroSection from "@/modules/home/ui/components/IntroSection";

interface HomeViewProps {
  username: string;
}

const HomeView = ({ username }: HomeViewProps) => {
  const user = useQuery(api.functions.users.getUser, {
    username,
  });
  const userLinks = useQuery(api.functions.userLinks.getUserLinks, {
    username,
  });
  const projects = useQuery(api.functions.projects.getProjects, {
    username,
    featured: true,
  });

  if (user === null || userLinks === null) {
    return <NotFoundView />;
  }

  if (user === undefined || userLinks === undefined) {
    return <Loading />;
  }

  return (
    <div className="flex-1 h-full px-6 md:px-12 max-w-7xl mx-auto">
      <IntroSection user={user} userLinks={userLinks} username={username} />

      <TechStackCloud projects={projects} />

      <div className="mt-4 mb-8 px-2 max-w-6xl mx-auto">
        <ProjectsShowcase projects={projects} username={username} />
      </div>

      <div className="h-[1px] bg-transparent" />
    </div>
  );
};

export default HomeView;
