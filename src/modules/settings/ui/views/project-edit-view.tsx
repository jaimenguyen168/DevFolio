"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2, Upload, X } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Project, ProjectId } from "@/modules/types";
import CustomFormField from "@/components/CustomFormField";
import ImageUploadDialog from "@/modules/settings/ui/components/ImageUploadDialog";
import { TECH_STACKS } from "@/modules/about/constants";
import TechStackFormField from "@/components/TechStackFormField";
import TextListFormField from "@/components/TextListFormField";

interface ProjectEditViewProps {
  username: string;
  project?: Project;
  onClose?: () => void;
}

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  url: z.url("Must be a valid URL").optional().or(z.literal("")),
  githubUrl: z.url("Must be a valid URL").optional().or(z.literal("")),
  imageUrls: z.array(z.string()).optional(),
  techStack: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  futureFeatures: z.array(z.string()).optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const ProjectEditView = ({
  username,
  project,
  onClose,
}: ProjectEditViewProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const user = useQuery(api.functions.users.getUser, { username });
  const createProject = useMutation(api.functions.projects.createProject);
  const updateProject = useMutation(api.functions.projects.updateProject);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      url: "",
      githubUrl: "",
      imageUrls: [],
      techStack: [],
      features: [],
      futureFeatures: [],
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description,
        url: project.url || "",
        githubUrl: project.githubUrl || "",
        imageUrls: project.imageUrls || [],
        techStack: project.techStack || [],
        features: project.features || [],
        futureFeatures: project.futureFeatures || [],
      });
    }
  }, [project, form]);

  const onSubmit = async (data: ProjectFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const validTechStack = data.techStack?.filter((tech) =>
        TECH_STACKS.includes(tech as any),
      ) as any;

      const payload = {
        name: data.name,
        description: data.description,
        url: data.url || undefined,
        githubUrl: data.githubUrl || undefined,
        imageUrls: data.imageUrls,
        techStack: validTechStack,
        features: data.features,
        futureFeatures: data.futureFeatures,
      };

      if (project) {
        await updateProject({
          projectId: project._id as ProjectId,
          updates: payload,
        });
        toast.success("Project updated successfully");
      } else {
        await createProject(payload);
        toast.success("Project added successfully");
      }

      onClose?.();
    } catch (error) {
      toast.error("Failed to save project");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    const currentImages = form.getValues("imageUrls") || [];
    form.setValue("imageUrls", [...currentImages, imageUrl]);
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues("imageUrls") || [];
    form.setValue(
      "imageUrls",
      currentImages.filter((_, i) => i !== index),
    );
  };

  const currentImages = form.watch("imageUrls") || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full lg:max-w-5xl mx-auto">
      <ImageUploadDialog
        open={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        onImageUploaded={handleImageUploaded}
        title="Add Project Image"
        description="Upload an image or provide a URL for the project"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">
          {project ? "Edit Project" : "Add Project"}
        </h1>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Project Images Section */}
          <Card className="bg-slate-900 border-gray-700">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1">
                      Project Images
                    </h3>
                    <p className="text-xs text-gray-400">
                      Add images to showcase your project
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setIsImageDialogOpen(true)}
                    variant="outline"
                    size="sm"
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                </div>

                {currentImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentImages.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden bg-gray-800 group"
                      >
                        <Image
                          src={imageUrl}
                          alt={`Project image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Project Name and Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="name"
              label="Project Name"
              placeholder="e.g. My Awesome App"
              required
            />
          </div>

          {/* Description */}
          <CustomFormField
            control={form.control}
            name="description"
            label="Description"
            placeholder="Describe your project..."
            multiline
            required
          />

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="url"
              label="Project URL"
              placeholder="https://example.com"
            />

            <CustomFormField
              control={form.control}
              name="githubUrl"
              label="GitHub URL"
              placeholder="https://github.com/username/repo"
            />
          </div>

          {/* Tech Stack */}
          <TechStackFormField control={form.control} name="techStack" />

          {/* Features */}
          <TextListFormField
            control={form.control}
            name="features"
            label="Key Features"
            placeholder="e.g. Real-time collaboration"
            helperText="Press Enter or click the + button to add each feature"
          />

          {/* Future Features */}
          <TextListFormField
            control={form.control}
            name="futureFeatures"
            label="Future Features"
            placeholder="e.g. Mobile app support"
            helperText="Press Enter or click the + button to add planned features"
          />

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={onClose}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-400 hover:bg-orange-300 text-white px-8 min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : project ? (
                "Update Project"
              ) : (
                "Add Project"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProjectEditView;
