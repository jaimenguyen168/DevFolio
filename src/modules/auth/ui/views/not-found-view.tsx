"use client";

import React from "react";
import CodeMirror, { EditorView, oneDark } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const NotFoundView = () => {
  const router = useRouter();

  const notFoundCode = `const page = findPage('you-were-looking-for');

if (!page) {
  console.log("Oops! Looks like you took a wrong turn.");
  console.log("But hey, since you're here...");
  console.log("🌟 Go back to the homepage and explore more cool stuff!");
  throw new Error("404: PageNotFoundError 😅");
}

/* Suggestions:
 * - Check the URL for typos
 * - Use the site navigation
 * - Or hit redirect('home') 😊
 */

redirect('home');`;

  const notFoundCodeMobile = `throw new Error(
  "404: PageNotFoundError 😅"
);
goBack() || goHome();`;

  const codeMirrorExtensions = [javascript(), EditorView.lineWrapping];

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full max-w-7xl mx-auto">
      {/* Left Side - 404 Display */}
      <div className="w-full h-auto md:h-full md:w-1/2 flex items-center justify-center px-16 pt-48 md:pt-0 pb-8 md:pb-96">
        <div className="md:text-center text-left flex-1">
          {/* Large 404 Text */}
          <div className="text-8xl md:text-9xl xl:text-[12rem] font-bold text-gray-500 mb-4 leading-none">
            404
          </div>

          {/* Error Message */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 text-left md:text-center">
            Page Not Found
          </h1>
        </div>
      </div>

      {/* Right Side - Code Mirror */}
      <div className="w-full justify-start md:justify-center items-center md:w-1/2 flex flex-col md:pb-96">
        {/* Code Content */}
        <div className="hidden md:block relative">
          <CodeMirror
            value={notFoundCode}
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

          <Button
            className="absolute px-12 -bottom-1 left-8 z-50 text-transparent cursor-pointer hover:bg-transparent hover:text-transparent"
            variant="ghost"
            onClick={handleGoHome}
          >
            Go Home
          </Button>
        </div>

        <div className="block relative md:hidden flex-1 justify-start items-start w-full px-16">
          <CodeMirror
            value={notFoundCodeMobile}
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

          <Button
            className="absolute -bottom-1 left-24 z-50 text-transparent hover:bg-transparent hover:text-transparent"
            variant="ghost"
            onClick={handleGoHome}
          >
            Go Back
          </Button>

          <Button
            className="absolute -bottom-2 left-48 z-50 text-transparent hover:bg-transparent hover:text-transparent"
            variant="ghost"
            onClick={handleGoHome}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundView;
