"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Building2, Loader2, Upload } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { formatRelativeTime } from "@/lib/utils";
import UserProfileImage from "@/components/UserProfileImage";
import Loading from "@/components/Loading";
import CustomFormField from "@/components/CustomFormField";
import { useRouter } from "next/navigation";
import ImageUploadDialog from "@/modules/settings/ui/components/ImageUploadDialog";
import Image from "next/image";
import HashtagFormField from "@/components/HashtagFormField";
import LinkFormField from "@/components/LinkFormField";
import ResumeManagement from "@/modules/settings/ui/components/ResumeManagement";

interface ProfileViewProps {
  username: string;
}

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Invalid email address"),
  title: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  links: z
    .array(
      z.object({
        label: z.string(),
        url: z.url("Invalid URL"),
      }),
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileView = ({ username }: ProfileViewProps) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const user = useQuery(api.functions.users.getUser, { username });
  const updateUser = useMutation(api.functions.users.updateUser);
  const userLinks = useQuery(api.functions.userLinks.getUserLinks, {
    username,
  });
  const createUserLink = useMutation(api.functions.userLinks.createUserLink);
  const updateUserLink = useMutation(api.functions.userLinks.updateUserLink);
  const deleteUserLink = useMutation(api.functions.userLinks.deleteUserLink);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      title: "",
      phone: "",
      bio: "",
      hashtags: [],
      imageUrl: "",
      links: [],
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        title: user.title || "",
        phone: user.phone || "",
        bio: user.bio || "",
        hashtags: user.hashtags || [],
        imageUrl: user.imageUrl || "",
        links:
          userLinks?.map((link) => ({
            label: link.label,
            url: link.url,
          })) || [],
      });
    }
  }, [user, form, userLinks]);

  const currentImageUrl = form.watch("imageUrl");

  const handleImageUploaded = (imageUrl: string) => {
    form.setValue("imageUrl", imageUrl);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    const usernameChanged = data.username !== user?.username;

    try {
      await updateUser({
        updates: {
          name: data.name,
          username: data.username,
          email: data.email,
          title: data.title,
          phone: data.phone,
          bio: data.bio,
          hashtags: data.hashtags,
          imageUrl: data.imageUrl,
        },
      });

      // Sync links
      const existingLinks = userLinks || [];
      const newLinks = data.links || [];

      // Create a map of existing links by label for easy lookup
      const existingLinksMap = new Map(
        existingLinks.map((link) => [link.label.toLowerCase(), link]),
      );

      // Create a map of new links by label
      const newLinksMap = new Map(
        newLinks.map((link) => [link.label.toLowerCase(), link]),
      );

      // Delete links that are no longer present
      for (const existingLink of existingLinks) {
        if (!newLinksMap.has(existingLink.label.toLowerCase())) {
          await deleteUserLink({ linkId: existingLink._id });
        }
      }

      // Update or create links
      for (const newLink of newLinks) {
        const existingLink = existingLinksMap.get(newLink.label.toLowerCase());

        if (existingLink) {
          // Update if URL changed
          if (existingLink.url !== newLink.url) {
            await updateUserLink({
              linkId: existingLink._id,
              updates: { url: newLink.url },
            });
          }
        } else {
          // Create new link
          await createUserLink({
            label: newLink.label,
            url: newLink.url,
          });
        }
      }

      if (usernameChanged && data.username) {
        router.replace(`/${data.username}/settings`);
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full lg:max-w-5xl mx-auto">
      {/* Image Upload Dialog */}
      <ImageUploadDialog
        open={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        onImageUploaded={handleImageUploaded}
        title="Update Company Logo"
        description="Upload an image or provide a URL for the company logo"
      />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-8 lg:mb-12">
        <div className="flex items-center space-x-3 sm:space-x-6 w-full sm:w-auto mb-4 lg:mb-0">
          <div
            className={`relative size-16 sm:size-20 lg:size-24 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600 flex-shrink-0 ${isEditing ? "cursor-pointer hover:opacity-80 transition-opacity group" : ""}`}
            onClick={() => isEditing && setIsImageDialogOpen(true)}
          >
            {isEditing ? (
              <>
                {currentImageUrl ? (
                  <Image
                    src={currentImageUrl}
                    alt="profile image"
                    height={500}
                    width={500}
                    className="object-cover size-full"
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-gray-600" />
                )}
                <div className="absolute inset-0 bg-black/50 group-hover:bg-opacity-100 transition-all flex items-center justify-center">
                  <Upload className="text-white opacity-70 group-hover:opacity-0 transition-opacity duration-300 size-8 cursor-pointer bg-gray-800 rounded-full p-2" />
                </div>
              </>
            ) : (
              <UserProfileImage user={user} />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h1 className="text-lg lg:text-2xl font-semibold text-white truncate">
              {user.name}
            </h1>
            <p className="text-sm lg:text-base text-gray-300 truncate">
              {user.email}
            </p>
            {user.title && (
              <p className="text-sm lg:text-base text-gray-400 truncate">
                {user.title}
              </p>
            )}
          </div>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-orange-400 hover:bg-orange-300 text-white px-4 lg:px-6 w-full lg:w-auto text-sm lg:text-base font-semibold"
          disabled={isSubmitting}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {/* Resume Section - Now using ResumeManagement component */}
      <ResumeManagement userId={user._id} isEditing={isEditing} />

      {/* Form Section */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 lg:space-y-8"
        >
          {/* Name and Username Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <CustomFormField
              control={form.control}
              name="name"
              label="Full Name"
              placeholder="Your First Name"
              disabled={!isEditing}
            />

            <CustomFormField
              control={form.control}
              name="username"
              label="Username"
              placeholder="Your Username"
              disabled={!isEditing}
            />
          </div>

          {/* Email and Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <CustomFormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your Email"
              disabled={!isEditing}
            />

            <CustomFormField
              control={form.control}
              name="title"
              label="Title"
              placeholder="e.g. Software Engineer"
              disabled={!isEditing}
            />
          </div>

          {/* Phone Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <CustomFormField
              control={form.control}
              name="phone"
              label="Phone"
              placeholder="+1 (555) 000-0000"
              disabled={!isEditing}
            />
          </div>

          {/* Bio */}
          <CustomFormField
            control={form.control}
            name="bio"
            label="Bio"
            placeholder="Tell us about yourself..."
            disabled={!isEditing}
            multiline
            minHeight="100px"
          />

          {/* Links */}
          <LinkFormField
            control={form.control}
            name="links"
            label="Social Links"
            disabled={!isEditing}
          />

          {/* Hashtags */}
          <HashtagFormField
            control={form.control}
            name="hashtags"
            label="Hashtags"
            placeholder="Add a hashtag..."
            disabled={!isEditing}
          />

          <p className="text-gray-400 text-xs sm:text-sm">
            Created {formatRelativeTime(user._creationTime)}
          </p>

          {/* Submit Button */}
          {isEditing && (
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-400 hover:bg-orange-300 text-white px-6 sm:px-8 w-full sm:w-auto text-sm sm:text-base"
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
      </Form>
    </div>
  );
};

export default ProfileView;
