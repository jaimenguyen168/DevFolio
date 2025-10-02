import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageUploaded: (imageUrl: string) => void;
  title?: string;
  description?: string;
}

const ImageUploadDialog = ({
  open,
  onOpenChange,
  onImageUploaded,
  title = "Update Image",
  description = "Upload an image or provide a URL",
}: ImageUploadDialogProps) => {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.functions.files.generateUploadUrl);
  const getImageUrl = useMutation(api.functions.files.getImageUrl);

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
      const uploadUrl = await generateUploadUrl();

      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      const { storageId } = await result.json();
      const publicImageUrl = await getImageUrl({ storageId });

      onImageUploaded(publicImageUrl as string);
      toast.success("Image uploaded successfully");
      onOpenChange(false);
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

    onImageUploaded(imageUrl.trim());
    toast.success("Image URL updated successfully");
    onOpenChange(false);
    setImageUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {description}
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
                className="w-full bg-gray-800 hover:bg-gray-700 hover:text-gray-200 text-white border border-gray-600"
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
  );
};

export default ImageUploadDialog;
