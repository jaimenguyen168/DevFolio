"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, X, Building2, Upload } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { WorkExperience, WorkExperienceId } from "@/modules/types";
import CustomFormField from "@/components/CustomFormField";
import ImageUploadDialog from "@/modules/settings/ui/components/ImageUploadDialog";
import { WORK_TYPES } from "@/modules/settings/constants";

interface WorkExperienceEditViewProps {
  username: string;
  experience?: WorkExperience;
  onClose?: () => void;
}

const workExperienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  type: z.enum(WORK_TYPES),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  responsibilities: z.array(z.string()).optional(),
});

type WorkExperienceFormValues = z.infer<typeof workExperienceSchema>;

const WorkExperienceEditView = ({
  username,
  experience,
  onClose,
}: WorkExperienceEditViewProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const user = useQuery(api.functions.users.getUser, { username });
  const createExperience = useMutation(
    api.functions.workExperience.createWorkExperience,
  );
  const updateExperience = useMutation(
    api.functions.workExperience.updateWorkExperience,
  );

  const form = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      company: "",
      position: "",
      type: "full-time",
      startDate: "",
      endDate: "",
      location: "",
      description: "",
      logoUrl: "",
      responsibilities: [],
    },
  });

  useEffect(() => {
    if (experience) {
      const isCurrently = !experience.endDate;
      setIsCurrentlyWorking(isCurrently);

      form.reset({
        company: experience.company,
        position: experience.position,
        type: experience.type,
        startDate: experience.startDate,
        endDate: experience.endDate || "",
        location: experience.location || "",
        description: experience.description || "",
        logoUrl: experience.logoUrl || "",
        responsibilities: experience.responsibilities || [],
      });
    }
  }, [experience, form]);

  const onSubmit = async (data: WorkExperienceFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const payload = {
        company: data.company,
        position: data.position,
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        description: data.description,
        logoUrl: data.logoUrl,
        responsibilities: data.responsibilities,
      };

      if (experience) {
        await updateExperience({
          workExperienceId: experience._id as WorkExperienceId,
          updates: payload,
        });
        toast.success("Work experience updated successfully");
      } else {
        await createExperience(payload);
        toast.success("Work experience added successfully");
      }

      onClose?.();
    } catch (error) {
      toast.error("Failed to save work experience");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addResponsibility = () => {
    if (responsibilityInput.trim()) {
      const current = form.getValues("responsibilities") || [];
      form.setValue("responsibilities", [
        ...current,
        responsibilityInput.trim(),
      ]);
      setResponsibilityInput("");
    }
  };

  const removeResponsibility = (index: number) => {
    const current = form.getValues("responsibilities") || [];
    form.setValue(
      "responsibilities",
      current.filter((_, i) => i !== index),
    );
  };

  const handleImageUploaded = (imageUrl: string) => {
    form.setValue("logoUrl", imageUrl);
  };

  const currentLogoUrl = form.watch("logoUrl");

  const renderLabel = (type: string) => {
    switch (type) {
      case "full-time":
        return "Full-time";
      case "part-time":
        return "Part-time";
      case "contract":
        return "Contract";
      case "internship":
        return "Internship";
      case "freelance":
        return "Freelance";
      case "consulting":
        return "Consulting";
      case "other":
        return "Other";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full lg:max-w-5xl mx-auto">
      <ImageUploadDialog
        open={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        onImageUploaded={handleImageUploaded}
        title="Update Company Logo"
        description="Upload an image or provide a URL for the company logo"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">
          {experience ? "Edit Work Experience" : "Add Work Experience"}
        </h1>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Logo Section */}
          <Card className="bg-slate-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="relative size-16 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center flex-shrink-0 p-1 cursor-pointer hover:opacity-80 transition-opacity group"
                    onClick={() => setIsImageDialogOpen(true)}
                  >
                    {currentLogoUrl ? (
                      <Image
                        src={currentLogoUrl}
                        alt="Company logo"
                        height={100}
                        width={100}
                        className="object-cover"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-gray-600" />
                    )}
                    <div className="absolute inset-0 bg-black/50 bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                      <Upload className="text-white opacity-70 group-hover:opacity-0 transition-opacity duration-300 size-8 cursor-pointer bg-gray-800 rounded-full p-2" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1">
                      Company Logo
                    </h3>
                    <p className="text-xs text-gray-400">
                      {currentLogoUrl
                        ? "Click to change logo"
                        : "Click to add a company logo"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company and Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="company"
              label="Company"
              placeholder="e.g. Google"
              required
            />

            <CustomFormField
              control={form.control}
              name="position"
              label="Position"
              placeholder="e.g. Software Engineer"
              required
            />
          </div>

          {/* Type and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-white text-base">
                    Employment Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700 w-full">
                      {WORK_TYPES.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="text-white hover:bg-gray-700 focus:bg-gray-700"
                        >
                          {renderLabel(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <CustomFormField
              control={form.control}
              name="location"
              label="Location"
              placeholder="e.g. San Francisco, CA"
            />
          </div>

          {/* Start Date and End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-base">
                    Start Date <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="month"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-base">
                    End Date
                    {!isCurrentlyWorking && (
                      <span className="text-red-500"> *</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="month"
                      disabled={isCurrentlyWorking}
                      className="bg-gray-800 border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-base">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe your role, achievements, and impact..."
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[120px] resize-none"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* Responsibilities */}
          <FormField
            control={form.control}
            name="responsibilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-base">
                  Key Responsibilities
                </FormLabel>
                <div className="space-y-3">
                  {field.value && field.value.length > 0 && (
                    <div className="space-y-2">
                      {field.value.map((responsibility, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors group"
                        >
                          <span className="text-orange-400 mt-0.5 flex-shrink-0">
                            •
                          </span>
                          <span className="flex-1 text-gray-300 text-sm">
                            {responsibility}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeResponsibility(index)}
                            className="text-gray-400 hover:text-red-400 hover:bg-gray-700 h-6 w-6 p-0 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      value={responsibilityInput}
                      onChange={(e) => setResponsibilityInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addResponsibility();
                        }
                      }}
                      placeholder="Add a responsibility and press Enter..."
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 flex-1"
                    />
                    <Button
                      type="button"
                      onClick={addResponsibility}
                      disabled={!responsibilityInput.trim()}
                      className="bg-orange-400 hover:bg-orange-300 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Press Enter or click the + button to add each responsibility
                  </p>
                </div>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
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
              ) : experience ? (
                "Update Experience"
              ) : (
                "Add Experience"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default WorkExperienceEditView;
