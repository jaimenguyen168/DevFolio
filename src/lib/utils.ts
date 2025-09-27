import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertName = (name: string) => {
  return `_${name.toLowerCase().replace(/\s+/g, "-")}`;
};
