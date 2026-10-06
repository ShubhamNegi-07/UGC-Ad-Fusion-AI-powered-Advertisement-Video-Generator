import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: Date | string | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function errorMessage(error: unknown, fallback = "Something went wrong") {
  if (typeof error === "object" && error !== null) {
    const maybe = error as { response?: { data?: { message?: string } }; message?: string };
    const message = maybe.response?.data?.message || maybe.message;
    if (message) return String(message).replace(/\s+/g, " ").trim().slice(0, 280);
  }
  return fallback;
}
