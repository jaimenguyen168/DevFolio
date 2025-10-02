import React from "react";
import { Control, FieldPath } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CustomFormFieldProps<T extends Record<string, any>> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  disabled?: boolean;
  multiline?: boolean;
  minHeight?: string;
  required?: boolean;
}

const CustomFormField = <T extends Record<string, any>>({
  control,
  name,
  label,
  placeholder,
  disabled = false,
  multiline = false,
  minHeight = "100px",
  required = false,
}: CustomFormFieldProps<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-white text-sm sm:text-base">
          {label} {required && <span className="text-red-500">*</span>}
        </FormLabel>
        <FormControl>
          {multiline ? (
            <Textarea
              {...field}
              placeholder={placeholder}
              disabled={disabled}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base resize-none"
              style={{ minHeight }}
            />
          ) : (
            <Input
              {...field}
              placeholder={placeholder}
              disabled={disabled}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
            />
          )}
        </FormControl>
        <FormMessage className="text-red-400 text-xs sm:text-sm" />
      </FormItem>
    )}
  />
);

export default CustomFormField;
