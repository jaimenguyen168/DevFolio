"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "_hello", href: "/home" },
  { label: "_about-me", href: "/about" },
  { label: "_projects", href: "/projects" },
  { label: "_contact-me", href: "/contact" },
];

const NavBar = () => {
  const user = useQuery(api.functions.users.getUser, {
    userId: "j97dbdkdcgqh3qzspzj8ffwwgh7qr86b" as Id<"users">,
  });

  const [selected, setSelected] = useState("_hello");
  const [open, setOpen] = useState(false);

  const mainNavLinks = navLinks.filter((link) => link.label !== "_contact-me");
  const contactLink = navLinks.find((link) => link.label === "_contact-me");

  const handleNavClick = (label: string) => {
    setSelected(label);
    setOpen(false); // Close dropdown when nav item is clicked
  };

  return (
    <nav className="flex items-center w-full border-b border-gray-700">
      {/* Desktop Navigation */}
      <div className="hidden lg:contents">
        <Link
          href="/home"
          className="w-[300px] px-8 py-5 border-r border-gray-700 text-gray-400 block"
        >
          {user?.name}
        </Link>

        {/* Main Navigation Links */}
        <div className="flex flex-1">
          {mainNavLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              onClick={() => setSelected(link.label)}
              className={`relative px-8 py-5 border-r border-gray-700 transition-colors ${
                selected === link.label
                  ? "text-orange-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {link.label}
              {/* Orange bottom border for selected item */}
              {selected === link.label && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400"></div>
              )}
            </Link>
          ))}
        </div>

        {/* Contact Link */}
        {contactLink && (
          <Link
            href={contactLink.href}
            onClick={() => setSelected(contactLink.label)}
            className={`relative px-8 py-5 border-l border-gray-700 transition-colors ${
              selected === contactLink.label
                ? "text-orange-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {contactLink.label}
            {/* Orange bottom border for selected contact */}
            {selected === contactLink.label && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400"></div>
            )}
          </Link>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center justify-between w-full px-6 py-5">
        <div className="text-gray-400">
          <Link href="/home">{user?.name}</Link>
        </div>

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-400 hover:text-white transition-colors">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            side="bottom"
            className="w-[calc(100vw-4rem)] h-[calc(100vh-12rem)] mx-8 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border-gray-700 font-mono rounded-none border-t-0 border-b-0"
            sideOffset={24}
          >
            <div className="px-6 py-2 border-b border-gray-700">
              <div className="text-gray-500 mb-3 font-mono"># navigate:</div>
            </div>

            {navLinks.map((link, index) => (
              <DropdownMenuItem
                key={index}
                asChild
                className={`px-0 py-0 text-[16px] text-white focus:bg-transparent hover:bg-transparent focus:!text-orange-300 hover:!text-orange-400 w-full rounded-none ${
                  selected === link.label
                    ? "text-orange-400"
                    : "text-white hover:text-orange-400"
                }`}
              >
                <Link
                  href={link.href}
                  onClick={() => handleNavClick(link.label)}
                  className={`block px-6 py-4 transition-colors font-mono w-full border-b border-gray-700 text-lg`}
                >
                  {link.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavBar;
