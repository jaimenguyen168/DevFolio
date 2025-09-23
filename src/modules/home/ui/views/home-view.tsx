"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import GameSection from "@/modules/home/ui/components/GameSection";
import NotFoundView from "@/modules/auth/ui/views/not-found-view";

interface HomeViewProps {
  username: string;
}

const HomeView = ({ username }: HomeViewProps) => {
  const user = useQuery(api.functions.users.getUser, {
    username: username,
  });

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  if (user === null) {
    return <NotFoundView />;
  }

  return (
    <div className="flex-1 px-12 pb-16 max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 xl:gap-16">
      {/* Left Side - Intro */}
      <div className="col-span-1 flex flex-col justify-center items-center">
        <div>
          <div className="mb-2 md:text-lg text-gray-400">Hi all. I am</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {user?.name}
          </h1>
          <div className="text-lg md:text-2xl text-indigo-500 mb-16">
            &gt; {user?.title || "No Title"}
          </div>

          {/* Code Comment Style Info */}
          <div className="space-y-2 text-gray-500 text-sm md:text-base">
            <div className="hidden lg:block">
              // win the game for a cookie 🍪
            </div>
            <div>// find my profile on Github:</div>
            <div className="flex flex-wrap items-center space-x-2 space-y-2 break-all">
              <span className="text-indigo-500">const</span>
              <span className="text-orange-300">githubLink</span>
              <span className="text-white">=</span>
              {/*<a*/}
              {/*  href={user?.githubLink}*/}
              {/*  target="_blank"*/}
              {/*  rel="noopener noreferrer"*/}
              {/*  className="text-green-400 break-all mb-1.5 hover:text-green-300 hover:underline cursor-pointer transition-colors"*/}
              {/*>*/}
              {/*  {user?.githubLink}*/}
              {/*</a>*/}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Game Section */}
      <div className="hidden xl:block max-w-2xl">
        <GameSection />
      </div>
    </div>
  );
};

export default HomeView;
