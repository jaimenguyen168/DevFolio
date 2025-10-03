"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Code } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DEFAULT_CONFIRMATION_EMAIL } from "@/constants/confirmationEmail";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../../../convex/_generated/api";
import Loading from "@/components/Loading";

const CustomizationsView = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailOption, setEmailOption] = useState<"default" | "custom">(
    "default",
  );
  const [customHtml, setCustomHtml] = useState("");
  const [initialCustomHtml, setInitialCustomHtml] = useState("");

  const customizations = useQuery(
    api.functions.customizations.getCustomizations,
  );
  const updateConfirmationEmail = useMutation(
    api.functions.customizations.updateConfirmationEmail,
  );

  useEffect(() => {
    if (customizations) {
      const useDefault = customizations.confirmationEmail.useDefault;
      setEmailOption(useDefault ? "default" : "custom");

      // Always load the custom HTML if it exists, regardless of which option is selected
      if (customizations.confirmationEmail.customHtml) {
        setCustomHtml(customizations.confirmationEmail.customHtml);
        setInitialCustomHtml(customizations.confirmationEmail.customHtml);
      }
    }
  }, [customizations]);

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
      await updateConfirmationEmail({
        useDefault: emailOption === "default",
        customHtml: customHtml || undefined, // Always save the custom HTML
      });

      // Update initial value after successful save
      setInitialCustomHtml(customHtml);

      toast.success("Email template saved successfully!");
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Failed to save email template. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if custom HTML has been edited
  const hasEdited = customHtml !== initialCustomHtml;

  // Show loading state while fetching
  if (customizations === undefined) {
    return <Loading />;
  }

  if (customizations === null) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full lg:max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 lg:mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-white">
          Customizations
        </h1>
      </div>

      {/* Form Section */}
      <div className="space-y-6 lg:space-y-8">
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
            onValueChange={async (value) => {
              const newValue = value as "default" | "custom";
              setEmailOption(newValue);

              if (newValue === "default") {
                try {
                  // Save with useDefault: true, but keep the customHtml
                  await updateConfirmationEmail({
                    useDefault: true,
                    customHtml: customHtml || undefined,
                  });
                  toast.success("Switched to default template");
                } catch (error) {
                  console.error("Failed to save:", error);
                  toast.error("Failed to update template");
                }
              } else if (newValue === "custom") {
                // Initialize with default template when switching to custom for the first time
                if (!customHtml) {
                  const defaultTemplate = DEFAULT_CONFIRMATION_EMAIL(
                    "${senderName}",
                    "${senderMessage}",
                    "${recipientEmail}",
                    "${recipientName}",
                  );
                  setCustomHtml(defaultTemplate);
                }

                // Update to use custom template
                try {
                  await updateConfirmationEmail({
                    useDefault: false,
                    customHtml: customHtml || undefined,
                  });
                  toast.success("Switched to custom template");
                } catch (error) {
                  console.error("Failed to save:", error);
                  toast.error("Failed to update template");
                }
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
              type="button"
              onClick={handleSubmit}
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
      </div>
    </div>
  );
};

export default CustomizationsView;
