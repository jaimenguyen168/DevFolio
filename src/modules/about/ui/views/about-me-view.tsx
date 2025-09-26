"use client";

import React, { useState } from "react";
import { Folder, File, Mail, Phone, User, X, PanelRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { api } from "../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import NotFoundView from "@/modules/auth/ui/views/not-found-view";
import { convertName } from "@/lib/utils";
import BioView from "@/modules/about/ui/views/bio-view";
import Loading from "@/components/Loading";

interface AboutMeViewProps {
  username: string;
}

const AboutMeView = ({ username }: AboutMeViewProps) => {
  const user = useQuery(api.functions.users.getUser, {
    username: username,
  });
  const educations = useQuery(api.functions.educations.getEducations, {
    username: username,
  });
  const workExperiences: any[] = [];

  const [activeContent, setActiveContent] = useState("bio");
  const [activeName, setActiveName] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleContentClick = (contentKey: string, name?: string) => {
    setActiveContent(contentKey);
    if (name) {
      setActiveName(name);
    } else {
      setActiveName(null);
    }
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (user === undefined) {
    return <Loading />;
  }

  if (user === null) {
    return <NotFoundView />;
  }

  const isBioEmpty = !user.bio || user.bio === "";
  const isWorkExperienceEmpty = workExperiences?.length === 0;
  const isEducationEmpty = educations?.length === 0;
  const hasHeaderContent =
    (!isBioEmpty && activeContent === "bio") ||
    (!isWorkExperienceEmpty && activeContent === "work-experience") ||
    (!isEducationEmpty && activeContent === "education");

  const renderContent = () => {
    switch (activeContent) {
      case "bio":
        return <BioView user={user} />;
      case "interests":
        return <div>interests</div>;
      case "work-experience":
        return <div>work-experience</div>;
      case "education":
        return <div>education</div>;
      default:
        return <div>bio</div>;
    }
  };

  const SidebarContent = () => (
    <Accordion
      type="multiple"
      defaultValue={["personal-info"]}
      className="w-full"
    >
      {/* Personal Info Section */}
      <AccordionItem value="personal-info" className="border-gray-700">
        <AccordionTrigger className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors hover:no-underline py-3.5 border-b border-gray-700 rounded-none px-4">
          <span className="flex items-center">
            <User size={16} className="mr-2" /> _personal-info
          </span>
        </AccordionTrigger>
        <AccordionContent className="pb-2">
          <div className="mt-2 space-y-2 ml-7">
            {/* Bio - Direct button, no accordion */}
            <Button
              variant="ghost"
              onClick={() => handleContentClick("bio")}
              className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:!text-orange-400 ${
                activeContent === "bio" ? "text-orange-400" : "text-gray-400"
              }`}
            >
              <File size={14} />
              <span>_bio.md</span>
            </Button>
            {/* Work Experience - Accordion */}
            <Accordion type="multiple" className="w-full">
              <AccordionItem
                value="work-experience"
                className="border-none ml-3"
              >
                <AccordionTrigger
                  className={`flex items-center space-x-2 transition-colors hover:no-underline py-1 hover:bg-transparent mb-2 hover:!text-purple-400 ${
                    activeContent === "work-experience"
                      ? "!text-purple-400"
                      : "text-gray-400"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContentClick("work-experience");
                  }}
                >
                  <span className="flex items-center">
                    <Folder size={16} className="mr-2" />
                    <span className="text-md">_work-experience</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <div className="space-y-1 ml-3">
                    {workExperiences?.map((work) => (
                      <Button
                        variant="ghost"
                        onClick={() => handleContentClick("work-experience")}
                        className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:text-purple-400 ${
                          activeContent === "work-experience"
                            ? "text-purple-400"
                            : "text-gray-400"
                        }`}
                      >
                        <File size={12} />
                        <span className="text-sm">
                          {convertName(work.company)}.md
                        </span>
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* Education Accordion - Only if there are education records */}
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="education" className="border-none ml-3">
                <AccordionTrigger
                  className={`flex items-center space-x-2 transition-colors hover:no-underline py-1 hover:bg-transparent mb-2 hover:!text-blue-400 ${
                    activeContent === "education"
                      ? "!text-blue-400 "
                      : "text-gray-400"
                  }`}
                >
                  <span className="flex items-center">
                    <Folder size={16} className="mr-2" />
                    <span className="text-md">_education</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <div className="space-y-1 ml-3">
                    {educations?.map((edu) => (
                      <Button
                        key={edu._id}
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContentClick("_education", edu.institution);
                        }}
                        className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:text-blue-400 ${
                          activeName === edu.institution
                            ? "text-blue-400"
                            : "text-gray-400 hover:text-blue-400"
                        }`}
                      >
                        <File size={12} />
                        <span className="text-sm truncate">
                          {convertName(edu.institution)}.md
                        </span>
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* TODO: Interests */}
            {/* Interests - Accordion */}
            {/*<Accordion type="multiple" className="w-full">*/}
            {/*  <AccordionItem value="interests" className="border-none ml-3">*/}
            {/*    <AccordionTrigger*/}
            {/*      className={`flex items-center space-x-2 transition-colors hover:no-underline py-1 hover:bg-transparent mb-2 hover:!text-green-400 ${*/}
            {/*        activeContent === "interests"*/}
            {/*          ? "!text-green-400"*/}
            {/*          : "text-gray-400"*/}
            {/*      }`}*/}
            {/*    >*/}
            {/*      <span className="flex items-center">*/}
            {/*        <Folder size={16} className="mr-2" />*/}
            {/*        <span className="text-md">_interests</span>*/}
            {/*      </span>*/}
            {/*    </AccordionTrigger>*/}
            {/*    <AccordionContent className="pb-1">*/}
            {/*      <div className="space-y-1 ml-3">*/}
            {/*        <Button*/}
            {/*          variant="ghost"*/}
            {/*          onClick={() => handleContentClick("interests")}*/}
            {/*          className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:text-green-400 ${*/}
            {/*            activeContent === "interests"*/}
            {/*              ? "text-green-400"*/}
            {/*              : "text-gray-400"*/}
            {/*          }`}*/}
            {/*        >*/}
            {/*          <File size={12} />*/}
            {/*          <span className="text-sm">interests.md</span>*/}
            {/*        </Button>*/}
            {/*      </div>*/}
            {/*    </AccordionContent>*/}
            {/*  </AccordionItem>*/}
            {/*</Accordion>*/}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Contacts Section */}
      <AccordionItem value="contacts" className="border-gray-700">
        <AccordionTrigger className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors hover:no-underline py-3.5 border-b border-gray-700 rounded-none px-4">
          <span className="flex items-center">
            <User size={16} className="mr-2" /> _contact
          </span>
        </AccordionTrigger>
        <AccordionContent className="pb-2">
          <div className="mt-2 space-y-2 ml-7">
            <Button disabled variant="ghost" className="text-gray-200">
              <Mail size={14} />
              <span className="text-sm">{user?.email}</span>
            </Button>
            {user?.phone && (
              <Button variant="ghost" className="text-gray-200" disabled>
                <Phone size={14} />
                <span className="text-sm">{user.phone}</span>
              </Button>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  if (educations === undefined) {
    return null;
  }

  if (!user) {
    return <NotFoundView />;
  }

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
          <span className="text-white font-medium">_about-me</span>
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
        {hasHeaderContent && (
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
                  {convertName(activeName || activeContent)}.md
                </span>
              </div>

              <button className="text-gray-500 hover:text-white cursor-pointer">
                ×
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 w-full h-full">
          {hasHeaderContent ? (
            renderContent()
          ) : (
            <div className="flex-1 flex h-full justify-center items-center">
              <p className="text-gray-400">
                {activeContent === "bio"
                  ? "No bio available"
                  : activeContent === "skills"
                    ? "No skills available"
                    : activeContent === "education"
                      ? "No education available"
                      : activeContent === "work-experience"
                        ? "No work experience available"
                        : "No content available"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutMeView;
