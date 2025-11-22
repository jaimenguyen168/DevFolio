"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import ProjectsShowcase from "@/modules/home/ui/components/ProjectsShowcase";
import NotFoundView from "@/modules/auth/ui/views/not-found-view";
import Loading from "@/components/Loading";
import Link from "next/link";

interface HomeViewProps {
  username: string;
}

const HomeView = ({ username }: HomeViewProps) => {
  const user = useQuery(api.functions.users.getUser, {
    username: username,
  });
  const userLinks = useQuery(api.functions.userLinks.getUserLinks, {
    username: username,
  });
  const projects = useQuery(api.functions.projects.getProjects, {
    username: username,
    featured: true,
  });

  if (user === undefined || userLinks === undefined || projects === undefined) {
    return <Loading />;
  }

  if (user === null || userLinks === null) {
    return <NotFoundView />;
  }

  const githubLink = userLinks.find((link) => link.label === "github");

  return (
    <div className="flex-1 h-full px-6 md:px-12 max-w-7xl mx-auto">
      {/* Intro Section */}
      <div className="flex flex-col justify-center items-center min-h-[30vh] md:min-h-[40vh] pt-8 lg:pt-16">
        <div className="text-center">
          <div className="mb-2 md:text-lg text-gray-400">Hi all. I am</div>
          <Link href={`/${username}/about`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent hover:scale-105 hover:text-orange-400 transition-all duration-300">
              {user?.name}
            </h1>
          </Link>
          <div className="text-lg md:text-2xl text-indigo-500 mb-8">
            &gt; {user?.title || "No Title"}
          </div>

          {/* Code Comment Style Info */}
          <div className="space-y-2 text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            <div>// check out my featured projects below ↓</div>
            <div>// or find my profile on Github:</div>
            <div className="flex flex-wrap items-center justify-center space-x-2 space-y-3 break-all">
              {githubLink ? (
                <>
                  <span className="text-indigo-500">const</span>
                  <span className="text-orange-300">githubLink</span>
                  <span className="text-white">=</span>
                  <a
                    href={githubLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 break-all mb-3 hover:text-green-300 hover:underline cursor-pointer transition-colors"
                  >
                    {githubLink.url}
                  </a>
                </>
              ) : (
                <span className="text-white">Your Github link goes here</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Showcase Section */}
      <div className="mt-4 mb-8 px-2 max-w-6xl mx-auto">
        <ProjectsShowcase projects={projects || []} username={username} />
      </div>

      <div className="h-[1px] bg-transparent" />
    </div>
  );
};

export default HomeView;
