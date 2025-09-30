"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { formatRelativeTime } from "@/lib/utils";
import UserProfileImage from "@/components/UserProfileImage";
import Loading from "@/components/Loading";

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
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileView = ({ username }: ProfileViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hashtagInput, setHashtagInput] = useState("");
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useQuery(api.functions.users.getUser, { username });
  const updateUser = useMutation(api.functions.users.updateUser);
  const generateUploadUrl = useMutation(api.functions.files.generateUploadUrl);

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
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
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
        },
      });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    setIsUploadingImage(true);
    try {
      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Upload the file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      const { storageId } = await result.json();

      // Update user with the storage ID
      await updateUser({
        updates: {
          imageUrl: storageId,
        },
      });

      toast.success("Profile image uploaded successfully");
      setIsImageDialogOpen(false);
      setSelectedFile(null);
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsUploadingImage(true);
    try {
      await updateUser({
        updates: {
          imageUrl: imageUrl.trim(),
        },
      });

      toast.success("Profile image updated successfully");
      setIsImageDialogOpen(false);
      setImageUrl("");
    } catch (error) {
      toast.error("Failed to update image");
      console.error(error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const addHashtag = () => {
    if (hashtagInput.trim()) {
      const currentHashtags = form.getValues("hashtags") || [];
      const newHashtag = hashtagInput.startsWith("#")
        ? hashtagInput.trim()
        : `#${hashtagInput.trim()}`;
      form.setValue("hashtags", [...currentHashtags, newHashtag]);
      setHashtagInput("");
    }
  };

  const removeHashtag = (index: number) => {
    const currentHashtags = form.getValues("hashtags") || [];
    form.setValue(
      "hashtags",
      currentHashtags.filter((_, i) => i !== index),
    );
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full lg:max-w-5xl mx-auto">
      {/* Image Upload Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Image</DialogTitle>
            <DialogDescription className="text-gray-400">
              Upload an image or provide a URL for your profile picture
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
                  variant="outline"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {selectedFile ? selectedFile.name : "Choose File"}
                </Button>
                {selectedFile && (
                  <div className="text-sm text-gray-400">
                    Size: {(selectedFile.size / 1024).toFixed(2)} KB
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleUploadImage}
                  disabled={!selectedFile || isUploadingImage}
                  className="bg-orange-400 hover:bg-orange-300 text-white w-full"
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Image"
                  )}
                </Button>
              </DialogFooter>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-4">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleUrlSubmit}
                  disabled={!imageUrl.trim() || isUploadingImage}
                  className="bg-orange-400 hover:bg-orange-300 text-white w-full"
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Set Image URL"
                  )}
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-8 lg:mb-12">
        <div className="flex items-center space-x-3 sm:space-x-6 w-full sm:w-auto">
          <div
            className={`relative size-16 sm:size-20 lg:size-24 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600 flex-shrink-0 ${isEditing ? "cursor-pointer hover:opacity-80 transition-opacity group" : ""}`}
            onClick={() => isEditing && setIsImageDialogOpen(true)}
          >
            <UserProfileImage user={user} />
            {isEditing && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                <Upload className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6" />
              </div>
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

      {/* Form Section */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 lg:space-y-8"
        >
          {/* Name and Username Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-sm sm:text-base">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your First Name"
                      disabled={!isEditing}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-sm sm:text-base">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your Username"
                      disabled={!isEditing}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>

          {/* Email and Image URL Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <FormItem>
              <FormLabel className="text-white text-sm sm:text-base">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  value={user.email}
                  disabled
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
                />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel className="text-white text-sm sm:text-base">
                Image URL
              </FormLabel>
              <FormControl>
                <Input
                  value={user.imageUrl || "No image set"}
                  disabled
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base truncate"
                />
              </FormControl>
            </FormItem>
          </div>

          {/* Title and Phone Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-sm sm:text-base">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Software Engineer"
                      disabled={!isEditing}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-sm sm:text-base">
                    Phone
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="+1 (555) 000-0000"
                      disabled={!isEditing}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>

          {/* Bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm sm:text-base">
                  Bio
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Tell us about yourself..."
                    disabled={!isEditing}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 disabled:opacity-70 disabled:cursor-not-allowed min-h-[100px] text-sm sm:text-base resize-none"
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          {/* Hashtags */}
          <FormField
            control={form.control}
            name="hashtags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm sm:text-base">
                  Hashtags
                </FormLabel>
                <div className="space-y-3">
                  {field.value && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-orange-400/20 text-orange-400 px-3 py-1 rounded-full text-xs sm:text-sm"
                        >
                          {tag}
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => removeHashtag(index)}
                              className="ml-1 hover:text-orange-300"
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addHashtag();
                          }
                        }}
                        placeholder="Add a hashtag..."
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 text-sm sm:text-base"
                      />
                      <Button
                        type="button"
                        onClick={addHashtag}
                        className="bg-orange-400 hover:bg-orange-300 text-white px-3 sm:px-4 text-sm sm:text-base"
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>
                <FormMessage className="text-red-400 text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          <p className="text-gray-400 text-xs sm:text-sm">
            Added {formatRelativeTime(user._creationTime)}
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
