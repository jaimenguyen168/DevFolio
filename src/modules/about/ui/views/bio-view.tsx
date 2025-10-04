import React from "react";
import Image from "next/image";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { oneDark } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { taglines } from "@/modules/about/constants";
import { User } from "@/modules/types";
import { Button } from "@/components/ui/button";
import { Download, FolderGit2 } from "lucide-react";
import UserProfileImage from "@/components/UserProfileImage";
import Link from "next/link";

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
    <div className="w-full h-full flex-1 flex flex-col gap-8 p-8 lg:p-16">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 max-w-7xl w-full mx-auto">
        {/* Left: Profile Image */}
        <div className="size-52 lg:size-64">
          <UserProfileImage user={user} />
        </div>

        {/* Right: Text Content */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-4xl font-bold text-white">
              {user.name || "Username"},
            </h1>
            <h2 className="text-xl lg:text-3xl font-bold text-white">
              {user.title || "Creative Technologist"}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white text-base rounded-md transition-colors"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Resume
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-base rounded-md transition-colors"
              size="lg"
            >
              <Link href={`/${user.username}/projects`}>
                <FolderGit2 className="w-5 h-5 mr-2" />
                View Projects
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Code View Section */}
      <div className="max-w-7xl w-full mx-auto space-y-6">
        {/* Hashtags */}
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-slate-700 text-gray-300 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bio Code Card */}
        <div className="bg-slate-800 rounded-3xl p-6 shadow-lg">
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
