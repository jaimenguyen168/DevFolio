import React from "react";
import { Control, FieldPath } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimeFormFieldProps<T extends Record<string, any>> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  disablePastDates?: boolean;
  disableFutureDates?: boolean;
  dateType?: "date" | "month" | "year";
}

const DateTimeFormField = <T extends Record<string, any>>({
  control,
  name,
  label,
  placeholder = "Pick a date and time",
  disabled = false,
  required = false,
  disablePastDates = false,
  disableFutureDates = false,
  dateType = "date",
}: DateTimeFormFieldProps<T>) => {
  const getFormatString = () => {
    switch (dateType) {
      case "year":
        return "yyyy";
      case "month":
        return "MMM yyyy";
      case "date":
      default:
        return "PPP";
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const dateValue = field.value ? new Date(field.value) : undefined;

        const handleDateSelect = (date: Date | undefined) => {
          field.onChange(date ? date.toISOString() : undefined);
        };

        return (
          <FormItem>
            <FormLabel className="text-white text-sm sm:text-base">
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "w-full pl-3 pr-10 text-left font-normal bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base justify-start relative",
                      !dateValue && "text-gray-500",
                    )}
                  >
                    <span className="block truncate max-w-[calc(100%-2rem)]">
                      {dateValue
                        ? format(dateValue, getFormatString())
                        : placeholder}
                    </span>
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    if (disableFutureDates && date > new Date()) return true;
                    if (disablePastDates && date < new Date()) return true;
                    return date < new Date("1900-01-01");
                  }}
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
            <FormMessage className="text-red-400 text-xs sm:text-sm" />
          </FormItem>
        );
      }}
    />
  );
};

export default DateTimeFormField;
