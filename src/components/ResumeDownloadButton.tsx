"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useQuery } from "convex/react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

interface ResumeDownloadButtonProps {
  userId: Id<"users">;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
}

const ResumeDownloadButton = ({
  userId,
  variant = "default",
  size = "lg",
  className = "bg-orange-600 hover:bg-orange-500 text-white text-base rounded-md transition-colors",
}: ResumeDownloadButtonProps) => {
  const [downloading, setDownloading] = useState(false);

  const resumeData = useQuery(api.functions.users.getResumeUrl, { userId });

  const handleDownload = async () => {
    if (!resumeData?.url) {
      toast.error("No resume available");
      return;
    }

    try {
      setDownloading(true);

      // Create download link
      const link = document.createElement("a");
      link.href = resumeData.url;
      link.download = resumeData.fileName || "resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Resume downloaded!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download resume");
    } finally {
      setDownloading(false);
    }
  };

  if (!resumeData?.url) {
    return (
      <Button
        disabled
        className="bg-gray-600 cursor-not-allowed text-white text-base rounded-md opacity-50"
        size={size}
        aria-label="No Resume Available"
      >
        <Download className="w-5 h-5 mr-2" />
        No Resume Available
      </Button>
    );
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={downloading}
      variant={variant}
      className={className}
      size={size}
      aria-label="Download Resume"
    >
      <Download className="w-5 h-5 mr-2" />
      {downloading ? "Downloading..." : "Download Resume"}
    </Button>
  );
};

export default ResumeDownloadButton;
