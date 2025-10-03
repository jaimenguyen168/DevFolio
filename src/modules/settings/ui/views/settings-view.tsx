"use client";

import React, { useEffect, useState } from "react";
import { X, PanelRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { convertName } from "@/lib/utils";
import ProfileView from "@/modules/settings/ui/views/profile-view";
import WorkExperienceEditView from "@/modules/settings/ui/views/work-experience-edit-view";
import WorkExperienceListView from "@/modules/settings/ui/views/work-experience-list-view";
import { MENU_SECTIONS } from "@/modules/settings/constants";
import EducationEditView from "@/modules/settings/ui/views/education-edit-view";
import EducationListView from "@/modules/settings/ui/views/education-list-view";
import ProjectListView from "@/modules/settings/ui/views/project-list-view";
import ProjectEditView from "@/modules/settings/ui/views/project-edit-view";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CustomizationsView from "@/modules/settings/ui/views/customizations-view";

interface SettingsViewProps {
  username: string;
}

const SettingsView = ({ username }: SettingsViewProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getInitialView = () => {
    const section = searchParams.get("section");
    return section || "profile";
  };

  const [activeView, setActiveView] = useState(getInitialView());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState<{ item?: any } | null>(null);

  useEffect(() => {
    const section = searchParams.get("section");
    if (section && section !== activeView) {
      setActiveView(section);
      setEditMode(null);
    }
  }, [searchParams]);

  const handleMenuClick = (viewKey: string) => {
    setActiveView(viewKey);
    setEditMode(null);
    setIsSidebarOpen(false);

    router.push(`${pathname}?section=${viewKey}`, { scroll: false });
  };

  const handleEdit = (item?: any) => {
    setEditMode({ item });
  };

  const handleClose = () => {
    if (editMode) {
      setEditMode(null);
    } else {
      router.push(`/${username}`, { scroll: true });
    }
  };

  const getViewTitle = () => {
    if (editMode) {
      return editMode.item ? `_edit-${activeView}.md` : `_add-${activeView}.md`;
    }
    return `${convertName(activeView)}.md`;
  };

  const PlaceholderView = ({ title }: { title: string }) => (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
      <p className="text-gray-400">Coming soon...</p>
    </div>
  );

  const renderView = () => {
    if (activeView === "profile") {
      return <ProfileView username={username} />;
    }
    if (activeView === "customizations") {
      return <CustomizationsView />;
    }
    if (activeView === "stats") {
      return <PlaceholderView title="Statistics" />;
    }

    if (activeView === "work-experience") {
      return editMode ? (
        <WorkExperienceEditView
          username={username}
          experience={editMode.item}
          onClose={handleClose}
        />
      ) : (
        <WorkExperienceListView username={username} onEdit={handleEdit} />
      );
    }

    if (activeView === "education") {
      return editMode ? (
        <EducationEditView
          username={username}
          education={editMode.item}
          onClose={handleClose}
        />
      ) : (
        <EducationListView username={username} onEdit={handleEdit} />
      );
    }

    if (activeView === "projects") {
      return editMode ? (
        <ProjectEditView
          username={username}
          project={editMode.item}
          onClose={handleClose}
        />
      ) : (
        <ProjectListView username={username} onEdit={handleEdit} />
      );
    }

    return <PlaceholderView title="Select an option" />;
  };

  return (
    <div className="flex flex-col md:flex-row h-full relative w-full">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
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
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-400 hover:bg-gray-700 hover:text-white p-1"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Accordion
            type="multiple"
            defaultValue={MENU_SECTIONS.map((section) => section.id)}
            className="w-full"
          >
            {MENU_SECTIONS.map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border-gray-700"
              >
                <AccordionTrigger className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors hover:no-underline py-3.5 border-b border-gray-700 rounded-none px-4">
                  <span className="flex items-center">
                    <section.icon size={16} className="mr-2" /> {section.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="mt-2 space-y-2 ml-7">
                    {section.items.map((item) => (
                      <Button
                        key={item.key}
                        variant="ghost"
                        onClick={() => handleMenuClick(item.key)}
                        className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:!text-orange-400 group ${
                          activeView === item.key && !editMode
                            ? "text-orange-400"
                            : "text-gray-400"
                        }`}
                      >
                        <item.icon
                          size={14}
                          className="group-hover:text-orange-400"
                        />
                        <span>{item.label}</span>
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden text-gray-400 hover:bg-gray-700 hover:text-white p-1 mr-3"
              >
                <PanelRight size={20} />
              </Button>
              <span className="text-gray-400 text-sm">{getViewTitle()}</span>
            </div>

            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-white cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full h-full overflow-y-auto">
          <div className="min-h-full">{renderView()}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
