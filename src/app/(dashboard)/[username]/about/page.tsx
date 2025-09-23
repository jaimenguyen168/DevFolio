import React from "react";
import AboutMeView from "@/modules/about/ui/views/about-me-view";

interface AboutPageProps {
  params: Promise<{ username: string }>;
}

const AboutPage = async ({ params }: AboutPageProps) => {
  const { username } = await params;

  if (!username) {
    return null;
  }

  return <AboutMeView username={username} />;
};
export default AboutPage;
