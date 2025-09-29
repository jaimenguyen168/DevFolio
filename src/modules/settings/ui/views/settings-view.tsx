import React from "react";

interface SettingsViewProps {
  username: string;
}

const SettingsView = ({ username }: SettingsViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-white">
      {username}
    </div>
  );
};
export default SettingsView;
