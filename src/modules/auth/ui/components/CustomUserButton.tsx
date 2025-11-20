"use client";

import React from "react";
import { Settings, LogOut, Mail, Home } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User } from "@/modules/types";
import UserProfileImage from "@/components/UserProfileImage";

interface CustomUserButtonProps {
  currentUser: User;
}

const CustomUserButton = ({ currentUser }: CustomUserButtonProps) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="size-6 md:size-10 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 hover:scale-105 transition-transform">
        <UserProfileImage user={currentUser} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="max-w-80 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border-gray-700 text-gray-300"
      >
        <DropdownMenuLabel className="text-gray-400 font-normal flex items-center space-x-2">
          <div className="size-8">
            <UserProfileImage user={currentUser} />
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">
              {user.firstName || user.username || "User"}
            </p>
            <p className="text-xs leading-none text-gray-400 truncate">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem
          className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-gray-400 hover:!text-white group"
          onClick={() => router.push("/")}
        >
          <Home className="mr-2 h-4 w-4 group-hover:text-white" />
          <span>Home</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-gray-400 hover:!text-white group"
          onClick={() => router.push(`/${currentUser.username}/settings`)}
        >
          <Settings className="mr-2 h-4 w-4 group-hover:text-white" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem
          className="cursor-pointer hover:bg-red-900/50 focus:bg-red-900/50 text-red-400 hover:!text-red-300 group"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4 group-hover:text-red-300" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomUserButton;
