"use client";

import React from "react";
import { ConvexReactClient } from "convex/react";
import { Toaster } from "@/components/ui/sonner";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file");
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <Toaster />
      {children}
    </ConvexProviderWithClerk>
  );
};
