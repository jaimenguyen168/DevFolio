"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { WorkExperience, WorkExperienceId } from "@/modules/types";
import WorkExperienceCard from "@/modules/settings/ui/components/WorkExperienceCard";
import ConfirmDialog from "@/components/ConfirmDialog";

interface WorkExperienceListViewProps {
  username: string;
  onEdit: (experience?: WorkExperience) => void;
}

const WorkExperienceListView = ({
  username,
  onEdit,
}: WorkExperienceListViewProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const workExperiences = useQuery(
    api.functions.workExperience.getWorkExperiences,
    { username },
  );
  const deleteExperience = useMutation(
    api.functions.workExperience.deleteWorkExperience,
  );

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteExperience({
        workExperienceId: deleteId as WorkExperienceId,
      });
      toast.success("Work experience deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete work experience");
      console.error(error);
    }
  };

  if (!workExperiences) {
    return <div className="p-8 text-gray-400">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full lg:max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Work Experience</h2>
        <Button
          onClick={() => onEdit()}
          className="bg-orange-400 hover:bg-orange-300 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {/* Experience Cards */}
      {workExperiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Building2 className="h-16 w-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No work experience yet
          </h3>
          <p className="text-gray-500 mb-6">
            Add your work experience to showcase your professional journey
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {workExperiences.map((experience, index) => (
              <motion.div
                key={experience._id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <WorkExperienceCard
                  experience={experience}
                  onEdit={onEdit}
                  onDelete={setDeleteId}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        description="Are you sure you want to delete this work experience? This action
              cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default WorkExperienceListView;
