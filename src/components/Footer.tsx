"use client";

import React from "react";
import { api } from "../../convex/_generated/api";
import { linkConfigs } from "@/constants/linkConfigs";
import { ExternalLink } from "lucide-react";
import { useQuery } from "convex/react";
import { useUsername } from "@/components/UsernameProvider";
import { UserButton } from "@clerk/nextjs";
import Terminal from "@/components/Terminal";

const Footer = () => {
  const { username } = useUsername();

  const isCurrentUser = useQuery(api.functions.users.isCurrentUser, {
    username: username as string,
  });

  const userLinks = useQuery(api.functions.userLinks.getUserLinks, {
    username: username as string,
  });

  const getIconByLabel = (label: string) => {
    const iconItem = linkConfigs.find(
      (item) => item.label.toLowerCase() === label.toLowerCase(),
    );
    if (iconItem) {
      const { Icon } = iconItem;
      return <Icon size={20} />;
    }
    return <ExternalLink size={20} />;
  };

  return (
    <div className="border-t border-gray-700 backdrop-blur-sm">
      <div className="flex items-center space-x-4">
        <div className="p-3 border-gray-700">
          <span className="text-gray-400 text-sm md:text-base">
            find me in:
          </span>
        </div>

        <div className="flex">
          {userLinks?.map((link, index) => (
            <div
              key={index}
              className="flex items-center text-gray-400 hover:text-white transition-colors border-r border-gray-700 py-4 px-3 first:border-l"
            >
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {getIconByLabel(link.label)}
              </a>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end text-gray-400 space-x-4 px-4 flex-1">
          {isCurrentUser && (
            <>
              <Terminal />
              <UserButton />
            </>
          )}

          <span className="text-sm md:text-base">
            © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
};
export default Footer;
