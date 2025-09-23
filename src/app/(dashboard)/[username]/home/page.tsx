import React from "react";
import HomeView from "@/modules/home/ui/views/home-view";

interface HomePageProps {
  params: Promise<{ username: string }>;
}

const HomePage = async ({ params }: HomePageProps) => {
  const { username } = await params;

  if (!username) {
    return null;
  }

  return <HomeView username={username} />;
};
export default HomePage;
