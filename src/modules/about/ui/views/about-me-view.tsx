"use client";

import React, { useState } from "react";
import {
  Folder,
  File,
  Mail,
  Phone,
  User,
  Menu,
  X,
  PanelRight,
} from "lucide-react";
import CodeMirror, { EditorView, oneDark } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { contentMap } from "@/modules/about/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import CodeSnippets from "@/modules/about/ui/components/CodeSnippets";

const AboutMeView = () => {
  const [activeContent, setActiveContent] = useState("bio");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleContentClick = (contentKey: string) => {
    setActiveContent(contentKey);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isEducationContent =
    activeContent === "education" ||
    activeContent === "high-school" ||
    activeContent === "university";

  const codeMirrorExtensions = [javascript(), EditorView.lineWrapping];

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
            <User size={16} className="mr-2" /> personal-info
          </span>
        </AccordionTrigger>
        <AccordionContent className="pb-2">
          <div className="mt-2 space-y-2 ml-7">
            <Button
              variant="ghost"
              onClick={() => handleContentClick("bio")}
              className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:!text-orange-400 ${
                activeContent === "bio" ? "text-orange-400" : "text-gray-400"
              }`}
            >
              <File size={14} />
              <span>bio.md</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleContentClick("interests")}
              className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:!text-green-400 ${
                activeContent === "interests"
                  ? "text-green-400"
                  : "text-gray-400"
              }`}
            >
              <File size={14} />
              <span>interests.md</span>
            </Button>

            {/* Nested Education Accordion */}
            <Accordion
              type="multiple"
              defaultValue={["education"]}
              className="w-full"
            >
              <AccordionItem value="education" className="border-none ml-3">
                <AccordionTrigger
                  className={`flex items-center space-x-2 transition-colors hover:no-underline py-1 hover:bg-transparent mb-2 hover:!text-blue-400 ${
                    isEducationContent ? "!text-blue-400 " : "text-gray-400"
                  }`}
                >
                  <span className="flex items-center">
                    <Folder size={16} className="mr-2" />
                    <span className="text-md">_education</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <div className="space-y-1 ml-3">
                    <Button
                      variant="ghost"
                      onClick={() => handleContentClick("high-school")}
                      className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:text-blue-400 ${
                        activeContent === "high-school"
                          ? "text-blue-400"
                          : "text-gray-400 hover:text-blue-400"
                      }`}
                    >
                      <File size={12} />
                      <span className="text-sm">_high-school.md</span>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleContentClick("university")}
                      className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:text-blue-400 ${
                        activeContent === "university"
                          ? "text-blue-400"
                          : "text-gray-400 hover:text-blue-400"
                      }`}
                    >
                      <File size={12} />
                      <span className="text-sm">_university.md</span>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
              <span className="text-sm">user@gmail.com</span>
            </Button>
            <Button variant="ghost" className="text-gray-200" disabled>
              <Phone size={14} />
              <span className="text-sm">+3598246359</span>
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <div className="flex flex-col sm:flex-row h-full relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md z-40 sm:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Left Sidebar - Desktop: Fixed, Mobile: Overlay */}
      <div
        className={`
        ${/* Desktop styles */ ""}
        sm:w-[300px] sm:border-r sm:border-gray-700 sm:flex sm:flex-col sm:h-full sm:relative sm:transform-none sm:transition-none
        ${/* Mobile styles */ ""}
        fixed top-0 left-0 h-full w-[280px] bg-slate-900 border-r border-gray-700 flex flex-col z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
      `}
      >
        {/* Mobile Close Button */}
        <div className="sm:hidden flex items-center justify-between p-4 border-b border-gray-700">
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

      {/* Right Container - Scrollable content (middle + right sections) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Tab Header */}
        <div className="items-center border-b border-gray-700 sticky top-0 bg-slate-900 z-10">
          <div className="px-4 py-3 flex items-center w-full sm:w-fit justify-between md:justify-start gap-3 sm:border-r sm:border-gray-700">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="sm:hidden text-gray-400 hover:bg-gray-700 hover:text-white p-1 mr-3"
              >
                <PanelRight size={20} />
              </Button>
              <span className="text-gray-400 text-sm">{activeContent}.md</span>
            </div>

            <button className="text-gray-500 hover:text-white cursor-pointer">
              ×
            </button>
          </div>
        </div>

        {/* Content Area - Stacks vertically on smaller screens, side by side on larger */}
        <div className="flex flex-col lg:flex-row flex-1">
          {/* Middle Section - CodeMirror Editor */}
          <div className="lg:flex-1 lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-700 flex flex-col p-4">
            <div className="lg:flex-1 lg:min-h-0">
              <CodeMirror
                value={contentMap[activeContent] || contentMap.bio}
                theme={oneDark}
                extensions={codeMirrorExtensions}
                editable={false}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: false,
                  dropCursor: false,
                  allowMultipleSelections: false,
                  indentOnInput: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  autocompletion: false,
                  highlightSelectionMatches: false,
                  searchKeymap: false,
                }}
                style={{
                  fontSize: "14px",
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  height: "100%",
                  backgroundColor: "transparent",
                }}
                className="[&_.cm-editor]:!bg-transparent [&_.cm-focused]:!bg-transparent [&_.cm-gutters]:w-8 [&_.cm-gutters]:min-w-8 [&_.cm-gutters]:!bg-transparent [&_.cm-gutter]:!bg-transparent [&_.cm-lineNumbers]:!bg-transparent h-full"
              />
            </div>
          </div>

          {/* Right Section - Code Snippets */}
          <div className="flex-1 lg:w-1/2 flex flex-col min-h-[400px] lg:min-h-0">
            <div className="flex-1 min-h-0">
              <CodeSnippets />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMeView;
