import React from "react";
import HomeView from "@/modules/home/ui/views/home-view";

interface HomePageProps {
  params: Promise<{ username: string }>;
}

const HomePage = async ({ params }: HomePageProps) => {
  const { username } = await params;

  console.log(username);

  return <HomeView />;
};
export default HomePage;
