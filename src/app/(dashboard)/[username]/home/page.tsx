import React from "react";
import { Metadata } from "next";
import HomeView from "@/modules/home/ui/views/home-view";
import { generatePageMetadata } from "@/constants/metadata";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  return generatePageMetadata(username, "home");
}

export default async function HomePage({ params }: PageProps) {
  const { username } = await params;

  return <HomeView username={username} />;
}
