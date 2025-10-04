"use client";

import React, { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import { linkConfigs } from "@/constants/linkConfigs";

interface Link {
  label: string;
  url: string;
}

interface LinkFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  disabled?: boolean;
}

const LinkFormField = <T extends FieldValues>({
  control,
  name,
  label = "Links",
  disabled = false,
}: LinkFormFieldProps<T>) => {
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [urlInput, setUrlInput] = useState("");

  const addLink = (
    currentValue: Link[] | undefined,
    onChange: (value: Link[]) => void,
  ) => {
    if (selectedLabel && urlInput.trim()) {
      const currentLinks = currentValue || [];

      // Check if label already exists
      const existingIndex = currentLinks.findIndex(
        (link) => link.label.toLowerCase() === selectedLabel.toLowerCase(),
      );

      if (existingIndex !== -1) {
        // Update existing link
        const updatedLinks = [...currentLinks];
        updatedLinks[existingIndex] = {
          label: selectedLabel,
          url: urlInput.trim(),
        };
        onChange(updatedLinks);
      } else {
        // Add new link
        onChange([
          ...currentLinks,
          { label: selectedLabel, url: urlInput.trim() },
        ]);
      }

      setSelectedLabel("");
      setUrlInput("");
    }
  };

  const removeLink = (
    index: number,
    currentValue: Link[] | undefined,
    onChange: (value: Link[]) => void,
  ) => {
    const currentLinks = currentValue || [];
    onChange(currentLinks.filter((_, i) => i !== index));
  };

  const getLinkIcon = (label: string) => {
    const config = linkConfigs.find(
      (c) => c.label.toLowerCase() === label.toLowerCase(),
    );
    return config?.Icon || ExternalLink;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white text-sm sm:text-base">
            {label}
          </FormLabel>
          <div className="space-y-3">
            {field.value && field.value.length > 0 && (
              <div className="space-y-2">
                {field.value.map((link: Link, index: number) => {
                  const Icon = getLinkIcon(link.label);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Icon
                          className="text-orange-400 flex-shrink-0"
                          size={20}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium capitalize">
                            {link.label}
                          </div>
                          <div className="text-gray-400 text-xs truncate">
                            {link.url}
                          </div>
                        </div>
                      </div>
                      {!disabled && (
                        <button
                          type="button"
                          onClick={() =>
                            removeLink(index, field.value, field.onChange)
                          }
                          className="ml-2 text-gray-400 hover:text-red-400 cursor-pointer flex-shrink-0"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {!disabled && (
              <div className="flex flex-1 items-center w-full gap-2">
                <Select value={selectedLabel} onValueChange={setSelectedLabel}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white text-sm sm:text-base">
                    <SelectValue placeholder="Select platform..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {linkConfigs.map((config) => {
                      const Icon = config.Icon;
                      return (
                        <SelectItem
                          key={config.label}
                          value={config.label}
                          className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Icon size={16} />
                            <span className="capitalize">{config.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLink(field.value, field.onChange);
                    }
                  }}
                  placeholder="Enter URL..."
                  disabled={!selectedLabel}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 text-sm sm:text-base"
                />
                <Button
                  type="button"
                  onClick={() => addLink(field.value, field.onChange)}
                  disabled={!selectedLabel || !urlInput.trim()}
                  className="bg-orange-400 hover:bg-orange-300 text-white px-3 sm:px-4 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
};

export default LinkFormField;
