"use client";

import React from "react";
import { api } from "../../convex/_generated/api";
import { linkConfigs } from "@/constants/linkConfigs";
import { ExternalLink } from "lucide-react";
import { useQuery } from "convex/react";
import { useUsername } from "@/components/UsernameProvider";
import Terminal from "@/components/Terminal";
import CustomUserButton from "@/modules/auth/ui/components/CustomUserButton";
import { User } from "@/modules/types";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

const Footer = () => {
  const { username } = useUsername();
  const isMobile = useIsMobile();

  const isCurrentUser = useQuery(api.functions.users.isCurrentUser, {
    username: username as string,
  });

  const currentUser = useQuery(api.functions.users.getCurrentUser);

  const userLinks = useQuery(api.functions.userLinks.getUserLinks, {
    username: username as string,
  });

  const getIconByLabel = (label: string) => {
    const iconItem = linkConfigs.find(
      (item) => item.label.toLowerCase() === label.toLowerCase(),
    );
    if (iconItem) {
      const { Icon } = iconItem;
      return <Icon size={isMobile ? 16 : 24} />;
    }
    return <ExternalLink size={isMobile ? 16 : 24} />;
  };

  const maxVisibleLinks = isMobile ? 2 : 3;
  const visibleLinks = userLinks?.slice(0, maxVisibleLinks) || [];
  const remainingCount = (userLinks?.length || 0) - maxVisibleLinks;

  return (
    <div className="border-t border-gray-700 backdrop-blur-sm">
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="p-2 md:p-4 border-gray-700">
          <span className="text-gray-400 text-xs md:text-base">
            find me in:
          </span>
        </div>

        <div className="flex">
          {visibleLinks.map((link, index) => (
            <div
              key={index}
              className="flex items-center text-gray-400 hover:text-white transition-colors border-r border-gray-700 p-3 md:p-4 first:border-l"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${link.label}`}
              >
                {getIconByLabel(link.label)}
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity whitespace-nowrap mb-2">
                  {link.label}
                </span>
              </a>
            </div>
          ))}

          {remainingCount > 0 && (
            <Link
              href={`/${username}/contact`}
              className="flex items-center text-gray-400 hover:text-white transition-colors border-r border-gray-700 p-3 md:p-4"
            >
              <span className="text-xs md:text-lg font-medium">
                +{remainingCount}
              </span>
            </Link>
          )}
        </div>

        <div className="flex items-center justify-end text-gray-400 space-x-2 md:space-x-4 px-2 md:px-4 flex-1">
          {isCurrentUser && (
            <>
              <Terminal />
              <CustomUserButton currentUser={currentUser as User} />
            </>
          )}

          <span className="text-xs md:text-base">
            © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
