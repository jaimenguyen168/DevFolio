import React from "react";
import { Metadata } from "next";
import AboutMeView from "@/modules/about/ui/views/about-me-view";
import { generatePageMetadata } from "@/constants/metadata";

interface AboutPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { username } = await params;
  return generatePageMetadata(username, "about");
}

const AboutPage = async ({ params }: AboutPageProps) => {
  const { username } = await params;

  if (!username) {
    return null;
  }

  return <AboutMeView username={username} />;
};

export default AboutPage;
