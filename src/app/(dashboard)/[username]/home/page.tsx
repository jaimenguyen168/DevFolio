import React from "react";
import { Metadata } from "next";
import HomeView from "@/modules/home/ui/views/home-view";

interface PageProps {
  params: { username: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = params;

  return {
    title: `${username} - Developer Portfolio | DevFolio`,
    description: `View ${username}'s professional developer portfolio on DevFolio.`,
    openGraph: {
      title: `${username} - Developer Portfolio | DevFolio`,
      description: `View ${username}'s professional developer portfolio on DevFolio.`,
      type: "profile",
      url: `https://devfolio.me/${username}`,
    },
    alternates: {
      canonical: `https://devfolio.me/${username}`,
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { username } = params;

  return <HomeView username={username} />;
}
