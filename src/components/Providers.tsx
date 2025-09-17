"use client";

import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file");
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
};
