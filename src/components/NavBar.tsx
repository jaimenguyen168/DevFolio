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

const navLinks = [
  { label: "_hello", href: "/home" },
  { label: "_about-me", href: "/about" },
  { label: "_projects", href: "/projects" },
  { label: "_contact-me", href: "/contact" },
];

const NavBar = () => {
  const { username } = useUsername();
  const user = useQuery(api.functions.users.getUser, {
    username: username as string,
  });

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
        <Link
          href="/home"
          className="w-[300px] px-8 py-5 border-r border-gray-700 text-gray-400 block"
        >
          {user?.name || "No User"}
        </Link>

        {user && (
          <>
            {/* Main Navigation Links */}
            <div className="flex flex-1">
              {mainNavLinks.map((link) => {
                const isActive = pathname === link.href;
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
        <div className="text-gray-400">
          <Link href="/home">{user?.name || "No User"}</Link>
        </div>

        {user && (
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <button
                suppressHydrationWarning
                className="text-gray-400 hover:text-white transition-colors"
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              side="bottom"
              className="w-[calc(100vw-4rem)] h-[calc(100vh-11.9rem)] mx-8 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border-gray-700 font-mono rounded-none border-t-0 border-b"
              sideOffset={24}
            >
              <div className="px-6 py-2 border-b border-gray-700">
                <div className="text-gray-500 mb-3 font-mono"># navigate:</div>
              </div>

              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <DropdownMenuItem
                    key={link.href}
                    asChild
                    className={`px-0 py-0 text-[16px] text-white focus:bg-transparent hover:bg-transparent w-full rounded-none ${
                      isActive
                        ? "text-orange-400 hover:!text-orange-300"
                        : "text-white hover:!text-orange-300"
                    }`}
                  >
                    <Link
                      href={link.href}
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
    </nav>
  );
};

export default NavBar;
