"use client";

import React, { useState } from "react";
import { Folder, File, Mail, Phone, User, Star, Eye } from "lucide-react";
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

  const handleContentClick = (contentKey: string) => {
    setActiveContent(contentKey);
  };

  const isEducationContent =
    activeContent === "education" ||
    activeContent === "high-school" ||
    activeContent === "university";

  const codeMirrorExtensions = [javascript(), EditorView.lineWrapping];

  return (
    <div className="flex flex-1 h-full">
      {/* Left Sidebar - Personal Info */}
      <div className="w-[300px] border-r border-gray-700 flex flex-col">
        <div className="flex-1">
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
                      activeContent === "bio"
                        ? "text-orange-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <File size={14} className="text-orange-400" />
                    <span>bio.md</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleContentClick("interests")}
                    className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:!text-green-400 ${
                      activeContent === "interests"
                        ? "text-green-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <File size={14} className="text-green-400" />
                    <span>interests.md</span>
                  </Button>

                  {/* Nested Education Accordion */}
                  <Accordion
                    type="multiple"
                    defaultValue={["education"]}
                    className="w-full"
                  >
                    <AccordionItem
                      value="education"
                      className="border-none ml-3"
                    >
                      <AccordionTrigger className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors hover:no-underline py-1">
                        <Button
                          className={`flex items-center !px-0 hover:bg-transparent hover:!text-blue-400 ${
                            isEducationContent
                              ? "text-blue-400"
                              : "text-gray-400 hover:text-white"
                          }`}
                          variant="ghost"
                        >
                          <Folder size={12} className="text-blue-400" />
                          education
                        </Button>
                      </AccordionTrigger>
                      <AccordionContent className="pb-1">
                        <div className="space-y-1 ml-3">
                          <Button
                            variant="ghost"
                            onClick={() => handleContentClick("high-school")}
                            className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:text-blue-400 ${
                              activeContent === "high-school"
                                ? "text-blue-400"
                                : "text-gray-500 hover:text-white"
                            }`}
                          >
                            <File size={12} />
                            <span className="text-sm">high-school.md</span>
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleContentClick("university")}
                            className={`flex items-center transition-colors w-full justify-start hover:bg-transparent hover:text-blue-400 ${
                              activeContent === "university"
                                ? "text-blue-400"
                                : "text-gray-500 hover:text-white"
                            }`}
                          >
                            <File size={12} />
                            <span className="text-sm">university.md</span>
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
                  <User size={16} className="mr-2" /> contact
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
        </div>
      </div>

      <div className="flex-col flex-1">
        <div className="items-center px-4 py-3  border-gray-700 flex w-fit border-r">
          <span className="text-gray-400 text-sm">{activeContent}.md</span>
          <button className="ml-3 text-gray-500 hover:text-white cursor-pointer">
            ×
          </button>
        </div>

        <div className="flex flex-1 h-full border-t border-gray-700">
          {/* Middle Section - CodeMirror Editor */}
          <div className="flex-1 w-1/2 border-r border-gray-700  flex flex-col p-4">
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
              className="[&_.cm-editor]:!bg-transparent [&_.cm-focused]:!bg-transparent [&_.cm-gutters]:w-8 [&_.cm-gutters]:min-w-8 [&_.cm-gutters]:!bg-transparent [&_.cm-gutter]:!bg-transparent [&_.cm-lineNumbers]:!bg-transparent"
            />
          </div>

          {/* Right Section - Code Snippets */}
          <div className="flex-1 w-1/2 bg-slate-900 flex flex-col">
            <CodeSnippets />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMeView;
