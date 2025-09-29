import React from "react";
import SettingsView from "@/modules/settings/ui/views/settings-view";

interface SettingsPageProps {
  params: Promise<{
    username: string;
  }>;
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { username } = await params;

  return <SettingsView username={username} />;
};

export default SettingsPage;
