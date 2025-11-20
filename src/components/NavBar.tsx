"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { useUsername } from "@/components/UsernameProvider";
import Image from "next/image";
import UserProfileImage from "@/components/UserProfileImage";
import { useIsMobile } from "@/hooks/use-mobile";

const navLinks = [
  { label: "_hello", href: "/home" },
  { label: "_about-me", href: "/about" },
  { label: "_projects", href: "/projects" },
  { label: "_contact-me", href: "/contact" },
];

const NavBar = () => {
  const { username } = useUsername();
  const isMobile = useIsMobile();
  const user = useQuery(api.functions.users.getUser, {
    username: username as string,
  });

  const currentUser = useQuery(api.functions.users.getCurrentUser);
  const isCurrentUser = user?._id === currentUser?._id;
  const showCurrentUserProfile = currentUser && !isCurrentUser;

  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const createNavLinks = (username: string) =>
    navLinks.map((link) => ({
      ...link,
      href: `/${username}${link.href}`,
    }));

  const navigationLinks = username ? createNavLinks(username) : [];
  const mainNavLinks = navigationLinks.filter(
    (link) => !link.label.includes("_contact-me"),
  );
  const contactLink = navigationLinks.find((link) =>
    link.label.includes("_contact-me"),
  );

  if (user === undefined) {
    return null;
  }

  return (
    <nav className="flex items-center w-full border-b border-gray-700">
      {/* Desktop Navigation */}
      <div className="hidden lg:contents">
        <div className="w-[360px] flex items-center space-x-4  px-8 py-5 border-r border-gray-700 justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Image
                src="/icon.png"
                alt="devfolio logo"
                width={25}
                height={25}
                className="size-7"
              />
            </Link>
            <Link
              href={`/${username}/home`}
              className="text-orange-400 hover:!text-orange-300 transition-colors"
            >
              {user?.name || "No User"}
            </Link>
          </div>

          {/* Current User Profile Image */}
          {showCurrentUserProfile && (
            <Link href={`/${currentUser.username}/home`} className="size-8">
              <UserProfileImage user={currentUser} />
            </Link>
          )}
        </div>

        {user && (
          <>
            {/* Main Navigation Links */}
            <div className="flex flex-1">
              {mainNavLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative w-40 py-5 flex justify-center border-r border-gray-700 transition-colors hover:!text-orange-300 ${
                      isActive ? "text-orange-400" : "text-gray-400"
                    }`}
                    suppressHydrationWarning
                  >
                    {link.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 hover:!bg-orange-300" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Contact Link */}
            {contactLink && (
              <Link
                href={contactLink.href}
                className={`relative w-40 flex justify-center py-5 border-l  hover:text-orange-300 border-gray-700 transition-colors ${
                  pathname === contactLink.href
                    ? "text-orange-400"
                    : "text-gray-400"
                }`}
                suppressHydrationWarning
              >
                {contactLink.label}
                {pathname === contactLink.href && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400"></div>
                )}
              </Link>
            )}
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center justify-between w-full px-6 py-5">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Image
              src="/icon.png"
              alt="devfolio logo"
              width={isMobile ? 24 : 32}
              height={isMobile ? 24 : 32}
            />
          </Link>
          <Link
            href={`/${username}/home`}
            className="text-orange-400 text-sm md:text-lg hover:!text-orange-300 transition-colors"
          >
            {user?.name || "No User"}
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Current User Profile Image */}
          {showCurrentUserProfile && (
            <Link href={`/${currentUser.username}/home`} className="size-8">
              <UserProfileImage user={currentUser} />
            </Link>
          )}
          {user && (
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  suppressHydrationWarning
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {open ? (
                    <X size={isMobile ? 24 : 28} />
                  ) : (
                    <Menu size={isMobile ? 24 : 28} />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                side="bottom"
                className="w-[calc(100vw-2rem)] md:w-[calc(100vw-4rem)] h-[calc(100vh-8.9rem)] md:h-[calc(100vh-11.9rem)] mx-4 md:mx-8 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border-gray-700 font-mono rounded-none border-t-0 border-b"
                sideOffset={24}
              >
                <div className="px-6 py-2 border-b border-gray-700">
                  <div className="text-gray-500 mb-3 font-mono">
                    # navigate:
                  </div>
                </div>

                {navLinks.map((link) => {
                  const fullPath = `/${username}${link.href}`;
                  const isActive = pathname.startsWith(fullPath);
                  return (
                    <DropdownMenuItem
                      key={fullPath}
                      asChild
                      className={`px-0 py-0 text-[16px] text-white focus:bg-transparent hover:bg-transparent w-full rounded-none ${
                        isActive
                          ? "text-orange-400 hover:!text-orange-300"
                          : "text-white hover:!text-orange-300"
                      }`}
                    >
                      <Link
                        href={fullPath}
                        className="block px-6 py-4 transition-colors font-mono w-full border-b border-gray-700 text-lg"
                      >
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
