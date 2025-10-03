"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Code } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DEFAULT_CONFIRMATION_EMAIL } from "@/constants/confirmationEmail";

const CustomizationsView = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailOption, setEmailOption] = useState<"default" | "custom">(
    "default",
  );
  const [customHtml, setCustomHtml] = useState("");
  const [initialCustomHtml, setInitialCustomHtml] = useState("");

  // Sample data for preview
  const sampleData = {
    senderName: "John Doe",
    senderMessage: "Hi, I'm interested in working with you on a project.",
    recipientEmail: "your@email.com",
    recipientName: "Your Name",
  };

  const getPreviewHtml = () => {
    if (emailOption === "default") {
      return DEFAULT_CONFIRMATION_EMAIL(
        sampleData.senderName,
        sampleData.senderMessage,
        sampleData.recipientEmail,
        sampleData.recipientName,
      );
    }
    return (
      customHtml ||
      DEFAULT_CONFIRMATION_EMAIL(
        sampleData.senderName,
        sampleData.senderMessage,
        sampleData.recipientEmail,
        sampleData.recipientName,
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Save to Convex
      console.log("Saving email settings:", {
        emailOption,
        customHtml: emailOption === "custom" ? customHtml : null,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update initial value after successful save
      setInitialCustomHtml(customHtml);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if custom HTML has been edited
  const hasEdited = customHtml !== initialCustomHtml;

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full lg:max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 lg:mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-white">
          Customizations
        </h1>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
        {/* Email Template Options */}
        <div className="space-y-4">
          <Label className="text-base font-medium text-white">
            Email Template
          </Label>
          <p className="text-sm text-gray-400">
            Customize the confirmation email sent to visitors who contact you
          </p>
          <RadioGroup
            value={emailOption}
            onValueChange={(value) => {
              setEmailOption(value as "default" | "custom");
              // Initialize with default template when switching to custom
              if (value === "custom" && !customHtml) {
                const defaultTemplate = DEFAULT_CONFIRMATION_EMAIL(
                  "${senderName}",
                  "${senderMessage}",
                  "${recipientEmail}",
                  "${recipientName}",
                );
                setCustomHtml(defaultTemplate);
                setInitialCustomHtml(defaultTemplate);
              }
            }}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800">
              <RadioGroupItem
                value="default"
                id="default"
                className="border-gray-400"
              />
              <Label
                htmlFor="default"
                className="flex-1 cursor-pointer text-gray-200"
              >
                <div className="font-medium">Use Default Template</div>
                <div className="text-sm text-gray-400">
                  Use the pre-designed confirmation email template
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800">
              <RadioGroupItem
                value="custom"
                id="custom"
                className="border-gray-400"
              />
              <Label
                htmlFor="custom"
                className="flex-1 cursor-pointer text-gray-200"
              >
                <div className="font-medium">Custom HTML</div>
                <div className="text-sm text-gray-400">
                  Create your own custom email template with HTML
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Custom HTML Editor (only show when custom is selected) */}
        {emailOption === "custom" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium text-white">
                Custom HTML Template
              </Label>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Code className="h-4 w-4" />
                <span>HTML Editor</span>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* HTML Editor */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-300">HTML Code</Label>
                <textarea
                  value={customHtml}
                  onChange={(e) => setCustomHtml(e.target.value)}
                  className="w-full h-96 p-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter your custom HTML template here..."
                />
                <p className="text-xs text-gray-400">
                  Available variables: {"{senderName}"}, {"{senderMessage}"},{" "}
                  {"{recipientEmail}"}, {"{recipientName}"}
                </p>
              </div>

              {/* Live Preview */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gray-300" />
                  <Label className="text-sm text-gray-300">Live Preview</Label>
                </div>
                <div className="w-full h-96 bg-white border border-gray-700 rounded-lg overflow-auto">
                  <iframe
                    srcDoc={getPreviewHtml()}
                    className="w-full h-full"
                    title="Email Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Preview uses sample data to show how your email will look
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Default Template Preview (only show when default is selected) */}
        {emailOption === "default" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-gray-300" />
              <Label className="text-base font-medium text-white">
                Template Preview
              </Label>
            </div>
            <div className="w-full h-96 bg-white border border-gray-700 rounded-lg overflow-auto">
              <iframe
                srcDoc={getPreviewHtml()}
                className="w-full h-full"
                title="Email Preview"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        )}

        {/* Submit Button - only show when custom is selected */}
        {emailOption === "custom" && (
          <div className="flex justify-end pt-4 border-t border-gray-700">
            <Button
              type="submit"
              disabled={isSubmitting || !hasEdited}
              className="bg-orange-400 hover:bg-orange-300 text-white px-6 sm:px-8 w-full sm:w-auto text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CustomizationsView;
