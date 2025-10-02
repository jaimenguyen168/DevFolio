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
import { Plus, X } from "lucide-react";

interface TextListFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  bulletStyle?: "dot" | "number";
}

const TextListFormField = <T extends FieldValues>({
  control,
  name,
  label = "Items",
  placeholder = "Add an item and press Enter...",
  helperText = "Press Enter or click the + button to add each item",
  disabled = false,
  bulletStyle = "dot",
}: TextListFormFieldProps<T>) => {
  const [inputValue, setInputValue] = useState("");

  const addItem = (
    currentValue: string[] | undefined,
    onChange: (value: string[]) => void,
  ) => {
    if (inputValue.trim()) {
      const current = currentValue || [];
      onChange([...current, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeItem = (
    index: number,
    currentValue: string[] | undefined,
    onChange: (value: string[]) => void,
  ) => {
    const current = currentValue || [];
    onChange(current.filter((_, i) => i !== index));
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white text-base">{label}</FormLabel>
          <div className="space-y-3">
            {field.value && field.value.length > 0 && (
              <div className="space-y-2">
                {field.value.map((item: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors group"
                  >
                    <span className="text-orange-400 mt-0.5 flex-shrink-0">
                      {bulletStyle === "number" ? `${index + 1}.` : "•"}
                    </span>
                    <span className="flex-1 text-gray-300 text-sm">{item}</span>
                    {!disabled && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeItem(index, field.value, field.onChange)
                        }
                        className="text-gray-400 hover:text-red-400 hover:bg-gray-700 h-6 w-6 p-0 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {!disabled && (
              <>
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem(field.value, field.onChange);
                      }
                    }}
                    placeholder={placeholder}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => addItem(field.value, field.onChange)}
                    disabled={!inputValue.trim()}
                    className="bg-orange-400 hover:bg-orange-300 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {helperText && (
                  <p className="text-xs text-gray-500">{helperText}</p>
                )}
              </>
            )}
          </div>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};

export default TextListFormField;
