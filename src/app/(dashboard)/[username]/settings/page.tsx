import React from "react";
import SettingsView from "@/modules/settings/ui/views/settings-view";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";

interface SettingsPageProps {
  params: Promise<{
    username: string;
  }>;
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { username } = await params;

  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const userFromUrl = await fetchQuery(api.functions.users.getUser, {
    username,
  });

  if (!userFromUrl || userFromUrl.externalId !== userId) {
    redirect("/");
  }

  return <SettingsView username={username} />;
};

export default SettingsPage;
