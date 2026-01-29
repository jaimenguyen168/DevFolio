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
import { cn } from "@/lib/utils";

const createNavLinks = (username: string) => [
  {
    label: "_hello",
    href: "/home",
    title: `${username}'s Portfolio - Developer Home Page`,
    description: `Visit ${username}'s developer portfolio homepage`,
  },
  {
    label: "_about-me",
    href: "/about",
    title: `About ${username} - Skills and Experience`,
    description: `Learn about ${username}'s background, skills and professional experience`,
  },
  {
    label: "_projects",
    href: "/projects",
    title: `${username}'s Projects - Code and Work Portfolio`,
    description: `Explore ${username}'s development projects and code samples`,
  },
  {
    label: "_contact-me",
    href: "/contact",
    title: `Contact ${username} - Get in Touch`,
    description: `Get in touch with ${username} for collaboration or opportunities`,
  },
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

  const createNavLinksWithPaths = (username: string) =>
    createNavLinks(username).map((link) => ({
      ...link,
      href: `/${username}${link.href}`,
    }));

  const navigationLinks =
    username && user?.name ? createNavLinksWithPaths(username) : [];
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
    <>
      <nav
        className={cn(
          "flex items-center w-full border-b border-gray-700 relative",
          isMobile ? "z-0" : "z-50",
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Desktop Navigation */}
        <div className="hidden lg:contents z-50">
          <div className="w-[360px] flex items-center space-x-4  px-8 py-5 border-r border-gray-700 justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                aria-label="DevFolio home page"
                title="DevFolio - Developer Portfolio Platform"
              >
                <Image
                  src="/icon.png"
                  alt="DevFolio logo"
                  width={25}
                  height={25}
                  className="size-7"
                />
              </Link>
              <Link
                href={`/${username}/home`}
                className="text-orange-400 hover:!text-orange-300 transition-colors"
                title={`View ${user?.name || "User"}'s portfolio home page`}
                aria-label={`Go to ${user?.name || "User"}'s portfolio`}
              >
                {user?.name || "No User"}
              </Link>
            </div>

            {/* Current User Profile Image */}
            {showCurrentUserProfile && (
              <Link
                href={`/${currentUser.username}/home`}
                className="size-8"
                title={`Go to ${currentUser.name}'s portfolio`}
                aria-label={`View ${currentUser.name}'s profile`}
              >
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
                      title={link.title}
                      aria-label={link.description}
                      aria-current={isActive ? "page" : undefined}
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
                  title={contactLink.title}
                  aria-label={contactLink.description}
                  aria-current={
                    pathname === contactLink.href ? "page" : undefined
                  }
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
        <div className="lg:hidden flex flex-1 items-center justify-between w-full px-6 py-5 z-50">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              aria-label="DevFolio home page"
              title="DevFolio - Developer Portfolio Platform"
            >
              <Image
                src="/icon.png"
                alt="DevFolio logo"
                width={isMobile ? 24 : 32}
                height={isMobile ? 24 : 32}
              />
            </Link>
            <Link
              href={`/${username}/home`}
              className="text-orange-400 text-sm md:text-lg hover:!text-orange-300 transition-colors"
              title={`View ${user?.name || "User"}'s portfolio home page`}
              aria-label={`Go to ${user?.name || "User"}'s portfolio`}
            >
              {user?.name || "No User"}
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Current User Profile Image */}
            {showCurrentUserProfile && (
              <Link
                href={`/${currentUser.username}/home`}
                className="size-8"
                title={`Go to ${currentUser.name}'s portfolio`}
                aria-label={`View ${currentUser.name}'s profile`}
              >
                <UserProfileImage user={currentUser} />
              </Link>
            )}
            {user && (
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    suppressHydrationWarning
                    className="text-gray-400 hover:text-white transition-colors relative z-50"
                    aria-label={
                      open ? "Close navigation menu" : "Open navigation menu"
                    }
                    title={open ? "Close menu" : "Open menu"}
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
                  className="w-[calc(100vw-2rem)] md:w-[calc(100vw-4rem)] mx-4 md:mx-8 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border-gray-700 font-mono rounded-none border-t-0 border-b h-80 overflow-y-auto relative z-40"
                  sideOffset={24}
                  role="menu"
                  aria-label="Main navigation menu"
                >
                  <div className="px-6 py-2 border-b border-gray-700">
                    <div className="text-gray-500 mb-3 font-mono">
                      # navigate:
                    </div>
                  </div>

                  {navigationLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                      <DropdownMenuItem
                        key={link.href}
                        asChild
                        className={`px-0 py-0 text-[16px] text-white focus:bg-transparent hover:bg-transparent w-full rounded-none ${
                          isActive
                            ? "text-orange-400 hover:!text-orange-300"
                            : "text-white hover:!text-orange-300"
                        }`}
                        role="menuitem"
                      >
                        <Link
                          href={link.href}
                          className="block px-6 py-4 transition-colors font-mono w-full border-b border-gray-700 text-lg"
                          title={link.title}
                          aria-label={link.description}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => setOpen(false)}
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

      {/* Full screen overlay when mobile menu is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 lg:hidden"
          style={{ top: "88px" }} // Adjust based on your navbar height
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default NavBar;
