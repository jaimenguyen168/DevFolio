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
import { Loader2, GraduationCap, Upload } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Education, EducationId } from "@/modules/types";
import CustomFormField from "@/components/CustomFormField";
import ImageUploadDialog from "@/modules/settings/ui/components/ImageUploadDialog";
import { EDUCATION_TYPES } from "@/modules/settings/constants";

interface EducationEditViewProps {
  username: string;
  education?: Education;
  onClose?: () => void;
}

const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().optional(),
  field: z.string().optional(),
  type: z.enum(EDUCATION_TYPES),
  startYear: z.number().min(1900).max(2100).optional(),
  endYear: z.number().min(1900).max(2100).optional(),
  location: z.string().optional(),
  grade: z.string().optional(),
  gpa: z.number().min(0).max(4).optional(),
  details: z.string().optional(),
  logoUrl: z.string().optional(),
});

type EducationFormValues = z.infer<typeof educationSchema>;

const EducationEditView = ({
  username,
  education,
  onClose,
}: EducationEditViewProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const user = useQuery(api.functions.users.getUser, { username });
  const createEducation = useMutation(api.functions.educations.createEducation);
  const updateEducation = useMutation(api.functions.educations.updateEducation);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      field: "",
      type: "university",
      startYear: undefined,
      endYear: undefined,
      location: "",
      grade: "",
      gpa: undefined,
      details: "",
      logoUrl: "",
    },
  });

  useEffect(() => {
    if (education) {
      const isCurrently = !education.endYear;
      setIsCurrentlyStudying(isCurrently);

      form.reset({
        institution: education.institution,
        degree: education.degree || "",
        field: education.field || "",
        type: education.type,
        startYear: education.startYear,
        endYear: education.endYear,
        location: education.location || "",
        grade: education.grade || "",
        gpa: education.gpa,
        details: education.details || "",
        logoUrl: education.logoUrl || "",
      });
    }
  }, [education, form]);

  const onSubmit = async (data: EducationFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const payload = {
        institution: data.institution,
        degree: data.degree,
        field: data.field,
        type: data.type,
        startYear: data.startYear,
        endYear: data.endYear,
        location: data.location,
        grade: data.grade,
        gpa: data.gpa,
        details: data.details,
        logoUrl: data.logoUrl,
      };

      if (education) {
        await updateEducation({
          educationId: education._id as EducationId,
          updates: payload,
        });
        toast.success("Education updated successfully");
      } else {
        await createEducation(payload);
        toast.success("Education added successfully");
      }

      onClose?.();
    } catch (error) {
      toast.error("Failed to save education");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    form.setValue("logoUrl", imageUrl);
  };

  const currentLogoUrl = form.watch("logoUrl");

  const renderTypeLabel = (type: string) => {
    switch (type) {
      case "high-school":
        return "High School";
      case "college":
        return "College";
      case "university":
        return "University";
      case "certification":
        return "Certification";
      case "bootcamp":
        return "Bootcamp";
      case "online-course":
        return "Online Course";
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
        title="Update Institution Logo"
        description="Upload an image or provide a URL for the institution logo"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">
          {education ? "Edit Education" : "Add Education"}
        </h1>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Institution Logo Section */}
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
                        alt="Institution logo"
                        height={100}
                        width={100}
                        className="object-cover"
                      />
                    ) : (
                      <GraduationCap className="h-8 w-8 text-gray-600" />
                    )}
                    <div className="absolute inset-0 bg-black/50 bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                      <Upload className="text-white opacity-70 group-hover:opacity-0 transition-opacity duration-300 size-8 cursor-pointer bg-gray-800 rounded-full p-2" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1">
                      Institution Logo
                    </h3>
                    <p className="text-xs text-gray-400">
                      {currentLogoUrl
                        ? "Click to change logo"
                        : "Click to add an institution logo"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Institution and Degree */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="institution"
              label="Institution"
              placeholder="e.g. Stanford University"
              required
            />

            <CustomFormField
              control={form.control}
              name="degree"
              label="Degree"
              placeholder="e.g. Bachelor of Science"
            />
          </div>

          {/* Field and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="field"
              label="Field of Study"
              placeholder="e.g. Computer Science"
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-white text-base">
                    Education Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700 w-full">
                      {EDUCATION_TYPES.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="text-white hover:bg-gray-700 focus:bg-gray-700"
                        >
                          {renderTypeLabel(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {/* Start Year and End Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-base">
                    Start Year
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="e.g. 2018"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined,
                        )
                      }
                      value={field.value || ""}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-base">
                    End Year
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="e.g. 2022"
                      disabled={isCurrentlyStudying}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined,
                        )
                      }
                      value={field.value || ""}
                      className="bg-gray-800 border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {/* Location and Grade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="location"
              label="Location"
              placeholder="e.g. Stanford, CA"
            />

            <CustomFormField
              control={form.control}
              name="grade"
              label="Grade"
              placeholder="e.g. First Class Honours"
            />
          </div>

          {/* GPA */}
          <FormField
            control={form.control}
            name="gpa"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-base">
                  GPA (0.0 - 4.0)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    placeholder="e.g. 3.8"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined,
                      )
                    }
                    value={field.value || ""}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* Details */}
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-base">Details</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add any additional details about your education, achievements, honors, or relevant coursework..."
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[120px] resize-none"
                  />
                </FormControl>
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
              ) : education ? (
                "Update Education"
              ) : (
                "Add Education"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EducationEditView;
