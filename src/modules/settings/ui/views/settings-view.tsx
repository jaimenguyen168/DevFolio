"use client";

import React, { useState } from "react";
import {
  User,
  X,
  PanelRight,
  Settings,
  BarChart3,
  Edit3,
  ScanFace,
  BriefcaseBusiness,
  LibraryBig,
  FolderGit2,
  Mail,
  UserCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { convertName } from "@/lib/utils";
import ProfileView from "@/modules/settings/ui/views/profile-view";

interface SettingsViewProps {
  username: string;
}

const SettingsView = ({ username }: SettingsViewProps) => {
  const [activeContent, setActiveContent] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleContentClick = (contentKey: string) => {
    setActiveContent(contentKey);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeContent) {
      case "profile":
        return <ProfileView username={username} />;
      case "settings":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Settings</h2>
            <p className="text-gray-400">General settings coming soon...</p>
          </div>
        );
      case "stats":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Statistics
            </h2>
            <p className="text-gray-400">Stats dashboard coming soon...</p>
          </div>
        );
      case "edit-bio":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Edit Bio</h2>
            <p className="text-gray-400">Bio editor coming soon...</p>
          </div>
        );
      case "edit-work-experience":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Edit Work Experience
            </h2>
            <p className="text-gray-400">
              Work experience editor coming soon...
            </p>
          </div>
        );
      case "edit-education":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Edit Education
            </h2>
            <p className="text-gray-400">Education editor coming soon...</p>
          </div>
        );
      case "edit-projects":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Edit Projects
            </h2>
            <p className="text-gray-400">Projects editor coming soon...</p>
          </div>
        );
      case "edit-contact":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Edit Contact
            </h2>
            <p className="text-gray-400">Contact editor coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="p-8">
            <p className="text-gray-400">Select an option from the sidebar</p>
          </div>
        );
    }
  };

  const SidebarContent = () => (
    <Accordion
      type="multiple"
      defaultValue={["user", "edit"]}
      className="w-full"
    >
      {/* User Section */}
      <AccordionItem value="user" className="border-gray-700">
        <AccordionTrigger className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors hover:no-underline py-3.5 border-b border-gray-700 rounded-none px-4">
          <span className="flex items-center">
            <User size={16} className="mr-2" /> _user-info
          </span>
        </AccordionTrigger>
        <AccordionContent className="pb-2">
          <div className="mt-2 space-y-2 ml-7">
            {/* Profile */}
            <Button
              variant="ghost"
              onClick={() => handleContentClick("profile")}
              className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:!text-orange-400 group ${
                activeContent === "profile"
                  ? "text-orange-400"
                  : "text-gray-400"
              }`}
            >
              <UserCircle size={14} className="group-hover:text-orange-400" />
              <span>_profile.md</span>
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              onClick={() => handleContentClick("settings")}
              className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:!text-purple-400 group ${
                activeContent === "settings"
                  ? "text-purple-400"
                  : "text-gray-400"
              }`}
            >
              <Settings size={14} className="group-hover:text-purple-400" />
              <span>_settings.md</span>
            </Button>

            {/* Stats */}
            <Button
              variant="ghost"
              onClick={() => handleContentClick("stats")}
              className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:!text-blue-400 group ${
                activeContent === "stats" ? "text-blue-400" : "text-gray-400"
              }`}
            >
              <BarChart3 size={14} className="group-hover:text-blue-400" />
              <span>_stats.md</span>
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Edit Section */}
      <AccordionItem value="edit" className="border-gray-700">
        <AccordionTrigger className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors hover:no-underline py-3.5 border-b border-gray-700 rounded-none px-4">
          <span className="flex items-center">
            <Edit3 size={16} className="mr-2" /> _manage-user
          </span>
        </AccordionTrigger>
        <AccordionContent className="pb-2">
          <div className="mt-2 space-y-2 ml-7">
            {/* Bio */}
            <Button
              variant="ghost"
              onClick={() => handleContentClick("edit-bio")}
              className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:!text-orange-400 group ${
                activeContent === "edit-bio"
                  ? "text-orange-400"
                  : "text-gray-400"
              }`}
            >
              <ScanFace size={14} className="group-hover:text-orange-400" />
              <span>_bio.md</span>
            </Button>

            {/* Work Experience */}
            <Button
              variant="ghost"
              onClick={() => handleContentClick("edit-work-experience")}
              className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:!text-purple-400 group ${
                activeContent === "edit-work-experience"
                  ? "text-purple-400"
                  : "text-gray-400"
              }`}
            >
              <BriefcaseBusiness
                size={14}
                className="group-hover:text-purple-400"
              />
              <span>_work-experience.md</span>
            </Button>

            {/* Education */}
            <Button
              variant="ghost"
              onClick={() => handleContentClick("edit-education")}
              className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:!text-blue-400 group ${
                activeContent === "edit-education"
                  ? "text-blue-400"
                  : "text-gray-400"
              }`}
            >
              <LibraryBig size={14} className="group-hover:text-blue-400" />
              <span>_education.md</span>
            </Button>

            {/* Projects */}
            <Button
              variant="ghost"
              onClick={() => handleContentClick("edit-projects")}
              className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:!text-green-400 group ${
                activeContent === "edit-projects"
                  ? "text-green-400"
                  : "text-gray-400"
              }`}
            >
              <FolderGit2 size={14} className="group-hover:text-green-400" />
              <span>_projects.md</span>
            </Button>

            {/* Contact */}
            <Button
              variant="ghost"
              onClick={() => handleContentClick("edit-contact")}
              className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:!text-pink-400 group ${
                activeContent === "edit-contact"
                  ? "text-pink-400"
                  : "text-gray-400"
              }`}
            >
              <Mail size={14} className="group-hover:text-pink-400" />
              <span>_contact.md</span>
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <div className="flex flex-col md:flex-row h-full relative w-full">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Left Sidebar */}
      <div
        className={`
        md:w-[360px] md:border-r md:border-gray-700 md:flex md:flex-col md:h-full md:relative md:transform-none md:transition-none
        fixed top-0 left-0 h-full w-[360px] bg-slate-900 border-r border-gray-700 flex flex-col z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-700">
          <span className="text-white font-medium">_settings</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-gray-400 hover:bg-gray-700 hover:text-white p-1"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      {/* Right Container */}
      <div className="flex-1 flex flex-col h-full w-full">
        {/* Tab Header */}
        <div className="items-center border-b border-gray-700 sticky top-0 bg-slate-900 z-10">
          <div className="px-4 py-3 flex items-center w-full md:w-fit justify-between md:justify-start gap-3 md:border-r md:border-gray-700">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="md:hidden text-gray-400 hover:bg-gray-700 hover:text-white p-1 mr-3"
              >
                <PanelRight size={20} />
              </Button>
              <span className="text-gray-400 text-sm">
                {convertName(activeContent)}.md
              </span>
            </div>

            <button className="text-gray-500 hover:text-white cursor-pointer">
              ×
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full h-full overflow-y-auto">
          <div className="min-h-full">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
