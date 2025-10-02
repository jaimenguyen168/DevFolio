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

interface HashtagFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

const HashtagFormField = <T extends FieldValues>({
  control,
  name,
  label = "Hashtags",
  placeholder = "Add a hashtag...",
  disabled = false,
}: HashtagFormFieldProps<T>) => {
  const [hashtagInput, setHashtagInput] = useState("");

  const addHashtag = (
    currentValue: string[] | undefined,
    onChange: (value: string[]) => void,
  ) => {
    if (hashtagInput.trim()) {
      const currentHashtags = currentValue || [];
      const newHashtag = hashtagInput.startsWith("#")
        ? hashtagInput.trim()
        : `#${hashtagInput.trim()}`;
      onChange([...currentHashtags, newHashtag]);
      setHashtagInput("");
    }
  };

  const removeHashtag = (
    index: number,
    currentValue: string[] | undefined,
    onChange: (value: string[]) => void,
  ) => {
    const currentHashtags = currentValue || [];
    onChange(currentHashtags.filter((_, i) => i !== index));
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
              <div className="flex flex-wrap gap-2">
                {field.value.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-orange-400/20 text-orange-400 px-3 py-1 rounded-full text-xs sm:text-sm"
                  >
                    {tag}
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() =>
                          removeHashtag(index, field.value, field.onChange)
                        }
                        className="ml-1 hover:text-orange-300 cursor-pointer"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
            {!disabled && (
              <div className="flex gap-2">
                <Input
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addHashtag(field.value, field.onChange);
                    }
                  }}
                  placeholder={placeholder}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 text-sm sm:text-base"
                />
                <Button
                  type="button"
                  onClick={() => addHashtag(field.value, field.onChange)}
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
  );
};

export default HashtagFormField;
