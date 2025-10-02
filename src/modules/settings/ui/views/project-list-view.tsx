"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderGit2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { Project, ProjectId } from "@/modules/types";
import ProjectSettingsCard from "@/modules/settings/ui/components/ProjectSettingsCard";
import ConfirmDialog from "@/components/ConfirmDialog";

interface ProjectListViewProps {
  username: string;
  onEdit: (project?: Project) => void;
}

const ProjectListView = ({ username, onEdit }: ProjectListViewProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const projects = useQuery(api.functions.projects.getProjects, {
    username,
  });
  const deleteProject = useMutation(api.functions.projects.deleteProject);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteProject({
        projectId: deleteId as ProjectId,
      });
      toast.success("Project deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete project");
      console.error(error);
    }
  };

  if (!projects) {
    return <div className="p-8 text-gray-400">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full lg:max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        <Button
          onClick={() => onEdit()}
          className="bg-orange-400 hover:bg-orange-300 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Project Cards */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <FolderGit2 className="h-16 w-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No projects yet
          </h3>
          <p className="text-gray-500 mb-6">
            Add your projects to showcase your work and accomplishments
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <ProjectSettingsCard
                  project={project}
                  onEdit={onEdit}
                  onDelete={setDeleteId}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Floating Add Button (only shows when list is empty) */}
      {projects.length === 0 && (
        <Button
          onClick={() => onEdit()}
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-orange-400 hover:bg-orange-300 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default ProjectListView;
