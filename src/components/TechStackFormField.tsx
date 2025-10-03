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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { TECH_STACKS } from "@/modules/about/constants";

interface TechStackFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
}

const TechStackFormField = <T extends FieldValues>({
  control,
  name,
  label = "Tech Stack",
  description = "Add technologies used in this project",
  placeholder = "Search technologies...",
  disabled = false,
}: TechStackFormFieldProps<T>) => {
  const [techStackInput, setTechStackInput] = useState("");
  const [filteredTechStacks, setFilteredTechStacks] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (value: string) => {
    setTechStackInput(value);
    if (value.trim()) {
      const filtered = TECH_STACKS.filter((tech) =>
        tech.toLowerCase().includes(value.toLowerCase()),
      ).slice(0, 10);
      setFilteredTechStacks(filtered);
      setShowDropdown(true);
    } else {
      setFilteredTechStacks([]);
      setShowDropdown(false);
    }
  };

  const addTechStack = (
    tech: string,
    currentValue: string[] | undefined,
    onChange: (value: string[]) => void,
  ) => {
    const currentTech = currentValue || [];

    if (!TECH_STACKS.includes(tech as any)) {
      return;
    }

    if (!currentTech.includes(tech)) {
      onChange([...currentTech, tech]);
    }

    setTechStackInput("");
    setFilteredTechStacks([]);
    setShowDropdown(false);
  };

  const removeTechStack = (
    tech: string,
    currentValue: string[] | undefined,
    onChange: (value: string[]) => void,
  ) => {
    const currentTech = currentValue || [];
    onChange(currentTech.filter((t) => t !== tech));
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
          {description && (
            <p className="text-xs text-gray-400 mb-3">{description}</p>
          )}
          <div className="space-y-3">
            {field.value && field.value.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {field.value.map((tech: string, index: number) => (
                  <Badge
                    key={index}
                    className="bg-orange-500/20 text-orange-400 border-orange-500/30 pr-1"
                    variant="outline"
                  >
                    {tech}
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() =>
                          removeTechStack(tech, field.value, field.onChange)
                        }
                        className="ml-2 hover:text-orange-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            )}
            {!disabled && (
              <div className="relative">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={techStackInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          // Try to add exact match or first filtered result
                          const exactMatch = TECH_STACKS.find(
                            (tech) =>
                              tech.toLowerCase() ===
                              techStackInput.toLowerCase(),
                          );
                          if (exactMatch) {
                            addTechStack(
                              exactMatch,
                              field.value,
                              field.onChange,
                            );
                          } else if (filteredTechStacks.length > 0) {
                            addTechStack(
                              filteredTechStacks[0],
                              field.value,
                              field.onChange,
                            );
                          }
                        } else if (e.key === "Escape") {
                          setShowDropdown(false);
                          setFilteredTechStacks([]);
                        }
                      }}
                      onFocus={() => {
                        if (techStackInput && filteredTechStacks.length > 0) {
                          setShowDropdown(true);
                        }
                      }}
                      placeholder={placeholder}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 text-sm sm:text-base"
                    />
                    {/* Dropdown suggestions */}
                    {showDropdown && filteredTechStacks.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredTechStacks.map((tech) => (
                          <button
                            key={tech}
                            type="button"
                            onClick={() =>
                              addTechStack(tech, field.value, field.onChange)
                            }
                            className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white text-sm transition-colors"
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      const exactMatch = TECH_STACKS.find(
                        (tech) =>
                          tech.toLowerCase() === techStackInput.toLowerCase(),
                      );
                      if (exactMatch) {
                        addTechStack(exactMatch, field.value, field.onChange);
                      } else if (filteredTechStacks.length > 0) {
                        addTechStack(
                          filteredTechStacks[0],
                          field.value,
                          field.onChange,
                        );
                      }
                    }}
                    className="bg-orange-400 hover:bg-orange-300 text-white px-3 sm:px-4 text-sm sm:text-base"
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>
          <FormMessage className="text-red-400 text-xs sm:text-sm" />
        </FormItem>
      )}
    />
  );
};

export default TechStackFormField;
