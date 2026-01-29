"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Upload } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import ResumeDownloadButton from "@/components/ResumeDownloadButton";

interface ResumeManagementProps {
  userId: Id<"users">;
  isEditing: boolean;
}

const ResumeManagement = ({ userId, isEditing }: ResumeManagementProps) => {
  const [uploading, setUploading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const generateUploadUrl = useMutation(api.functions.users.generateUploadUrl);
  const uploadResume = useMutation(api.functions.users.uploadResume);
  const deleteResume = useMutation(api.functions.users.deleteResume);
  const resumeData = useQuery(api.functions.users.getResumeUrl, { userId });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or Word document");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    try {
      setUploading(true);

      // Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();

      // Update user record with resume info
      await uploadResume({
        userId,
        storageId,
        fileName: file.name,
      });

      toast.success("Resume uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload resume");
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const handleDeleteResume = async () => {
    try {
      setDeleting(true);
      await deleteResume({ userId });
      toast.success("Resume deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete resume");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="mb-8 lg:mb-12">
        <h2 className="text-lg lg:text-xl font-semibold text-white mb-4">
          Resume
        </h2>
        <div className="bg-gray-800 rounded-lg p-4 lg:p-6">
          {resumeData?.url ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-orange-400" />
                <div>
                  <p className="text-white font-medium">
                    {resumeData.fileName}
                  </p>
                  <p className="text-gray-400 text-sm">Resume uploaded</p>
                </div>
              </div>
              <div className="flex gap-2">
                <ResumeDownloadButton
                  userId={userId}
                  variant="outline"
                  size="default"
                  className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
                />
                {isEditing && (
                  <Button
                    onClick={() => setDeleteDialogOpen(true)}
                    variant="outline"
                    className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                    disabled={deleting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              {isEditing ? (
                <div className="relative inline-block">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <Button
                    className="bg-orange-400 hover:bg-orange-300 text-white"
                    disabled={uploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? "Uploading..." : "Upload Resume"}
                  </Button>
                </div>
              ) : (
                <p className="text-gray-400">No resume uploaded</p>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteResume}
        title="Delete Resume"
        description="Are you sure you want to delete your resume? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
};

export default ResumeManagement;
