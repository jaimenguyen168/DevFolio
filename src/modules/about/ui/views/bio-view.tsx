import React from "react";
import Image from "next/image";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { oneDark } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { taglines } from "@/modules/about/constants";
import { User } from "@/modules/types";

interface BioViewProps {
  user: User;
}

const BioView = ({ user }: BioViewProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const generateBioCode = () => {
    const bioLines = user.bio
      ? user.bio.split("\n").map((line) => `  "${line}"`)
      : ['  "No bio available"'];

    const randomTagline = taglines[Math.floor(Math.random() * taglines.length)];

    return `/**
 * ${randomTagline}
 */

const bio = {
  name: "${user.name || "Anonymous"}",
  title: "${user.title || ""}",
  description: [
${bioLines.join(",\n")}
  ]
};

export default bio;`;
  };

  const codeMirrorExtensions = [javascript(), EditorView.lineWrapping];

  const hashtags = user.hashtags || ["#developer", "#designer", "#creative"];

  return (
    <div className="w-full h-full flex-1 flex justify-center  p-8 lg:pt-16">
      <div className="relative flex flex-col lg:flex-row items-start gap-0 max-w-5xl w-full">
        {/* Profile Image Section */}
        <div className="relative flex-shrink-0 w-full lg:w-auto">
          <div className="bg-slate-700 rounded-3xl p-4 flex flex-col lg:flex-row gap-6 lg:gap-0">
            {/* Image or Initials */}
            <div className="flex-shrink-0">
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user.name}
                  width={500}
                  height={500}
                  className="lg:size-72 w-full h-[250px] object-cover rounded-2xl mx-auto lg:mx-0"
                />
              ) : (
                <div className="size-64 rounded-2xl bg-slate-700 flex items-center justify-center mx-auto lg:mx-0">
                  <span className="text-6xl font-bold text-slate-800 size-36 rounded-full bg-orange-300 flex items-center justify-center">
                    {user.name ? getInitials(user.name) : "?"}
                  </span>
                </div>
              )}
            </div>

            {/* Hashtags on mobile */}
            <div className="flex flex-wrap gap-2 lg:hidden items-start ml-0 lg:ml-6">
              {hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-600 text-gray-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Hashtags for desktop */}
          <div className="hidden lg:flex flex-wrap h-auto gap-2 mt-4 w-56">
            {hashtags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-slate-700 text-gray-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bio Content - CodeMirror Card */}
        <div className="bg-slate-800 lg:absolute left-84 top-16 rounded-3xl p-6 lg:-ml-24 mt-4 lg:mt-16 shadow-lg flex-1 lg:max-w-3xl z-10">
          <div className="h-auto">
            <CodeMirror
              value={generateBioCode()}
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
                fontSize: "13px",
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                height: "100%",
                backgroundColor: "transparent",
              }}
              className="[&_.cm-editor]:!bg-transparent [&_.cm-focused]:!bg-transparent [&_.cm-gutters]:w-8 [&_.cm-gutters]:min-w-8 [&_.cm-gutters]:!bg-transparent [&_.cm-gutter]:!bg-transparent [&_.cm-lineNumbers]:!bg-transparent h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioView;
