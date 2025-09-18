"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import GameSection from "@/modules/home/ui/components/GameSection";

const HomeView = () => {
  const user = useQuery(api.functions.users.getUser, {
    userId: "j97dbdkdcgqh3qzspzj8ffwwgh7qr86b" as Id<"users">,
  });

  return (
    <div className="flex-1 px-12 pb-16 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
      {/* Left Side - Intro */}
      <div className="col-span-1 flex flex-col justify-center items-start">
        <div className="mb-2 md:text-lg text-gray-400">Hi all. I am</div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {user?.name}
        </h1>
        <div className="text-lg md:text-2xl text-indigo-500 mb-16">
          &gt; {user?.title}
        </div>

        {/* Code Comment Style Info */}
        <div className="space-y-2 text-gray-500 text-sm md:text-base">
          <div className="hidden lg:block">
            // complete the game to continue
          </div>
          <div>// find my profile on Github:</div>
          <div className="flex flex-wrap items-center space-x-2 space-y-2 break-all">
            <span className="text-indigo-500">const</span>
            <span className="text-orange-300">githubLink</span>
            <span className="text-white">=</span>
            <span className="text-green-400 break-all">{user?.githubLink}</span>
          </div>
        </div>
      </div>

      {/* Right Side - Game Section */}
      <div className="hidden lg:block max-w-lg">
        <GameSection />
      </div>
    </div>
  );
};

export default HomeView;
