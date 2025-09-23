"use client";

import React from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { linkConfigs } from "@/constants/linkConfigs";
import { ExternalLink, TerminalSquare } from "lucide-react";
import { useQuery } from "convex/react";
import { useUsername } from "@/components/UsernameProvider";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Terminal from "@/components/Terminal";

const Footer = () => {
  const { username } = useUsername();

  const isCurrentUser = useQuery(api.functions.users.isCurrentUser, {
    username: username as string,
  });

  const userLinks = useQuery(api.functions.users.getUserLinks, {
    userId: "j97dbdkdcgqh3qzspzj8ffwwgh7qr86b" as Id<"users">,
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
        <div className="p-4 border-gray-700 flex-1 md:flex-none">
          <span className="text-gray-400">find me in:</span>
        </div>

        <div className="flex">
          {userLinks?.map((link, index) => (
            <div
              key={index}
              className="flex items-center text-gray-400 hover:text-white transition-colors border-r border-gray-700 p-4 first:border-l"
            >
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {getIconByLabel(link.label)}
              </a>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end text-gray-400 space-x-4 p-4 flex-none md:flex-1">
          {isCurrentUser && (
            <>
              <Terminal />
              <UserButton />
            </>
          )}

          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
};
export default Footer;
