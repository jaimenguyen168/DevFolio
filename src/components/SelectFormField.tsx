import React from "react";
import { Control, FieldPath } from "react-hook-form";
import {
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

interface SelectFormFieldProps<T extends Record<string, any>> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  options: readonly string[];
  required?: boolean;
  disabled?: boolean;
  renderLabel?: (value: any) => string;
}

const SelectFormField = <T extends Record<string, any>>({
  control,
  name,
  label,
  placeholder = "Select an option",
  options,
  required = false,
  disabled = false,
  renderLabel,
}: SelectFormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel className="text-white text-sm sm:text-base">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-full hover:bg-gray-700 disabled:opacity-70 disabled:cursor-not-allowed">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-gray-800 border-gray-700 w-full">
              {options.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700 hover:!text-white focus:text-white"
                >
                  {renderLabel ? renderLabel(option) : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-red-400 text-xs sm:text-sm" />
        </FormItem>
      )}
    />
  );
};

export default SelectFormField;
