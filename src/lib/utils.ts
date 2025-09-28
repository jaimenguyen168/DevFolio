import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertName = (name: string) => {
  return `_${name.toLowerCase().replace(/\s+/g, "-")}`;
};

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

export const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < MINUTE) return "just now";
  if (diffInSeconds < HOUR)
    return `${Math.floor(diffInSeconds / MINUTE)} minutes ago`;
  if (diffInSeconds < DAY)
    return `${Math.floor(diffInSeconds / HOUR)} hours ago`;
  if (diffInSeconds < MONTH)
    return `${Math.floor(diffInSeconds / DAY)} days ago`;
  if (diffInSeconds < YEAR)
    return `${Math.floor(diffInSeconds / MONTH)} months ago`;
  return `${Math.floor(diffInSeconds / YEAR)} years ago`;
};

export const formatFullDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
