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

export const GENERIC_ERROR_MESSAGE =
  "Something went wrong. Please check your connection and try again.";

const TECHNICAL_ERROR =
  /stack:|at\s+\S+\s+\(|axioserror|econnrefused|enotfound|etimedout|prisma|postgresql|neon\.tech|cloudinary|hugging\s?face|hf_token|gemini_api|resource_exhausted|request failed with status code|network error|timeout of \d+ms|whsec_|svix|node_modules|internal server error|errno|aggregateerror|cannot read propert|undefined is not|failed to fetch|load failed|origin not allowed|status code 5\d\d/i;

function looksSafeUserMessage(message: string): boolean {
  if (message.length > 220) return false;
  if (message.includes("\n") && /\bat\s+/.test(message)) return false;
  if (/https?:\/\/\S+\.(ts|js|tsx|jsx)/i.test(message)) return false;
  if (TECHNICAL_ERROR.test(message)) return false;
  return true;
}

export function safeUserMessage(value: unknown, fallback = GENERIC_ERROR_MESSAGE): string {
  if (typeof value !== "string") return fallback;
  const clean = value.replace(/\s+/g, " ").trim();
  if (!clean) return fallback;
  return looksSafeUserMessage(clean) ? clean.slice(0, 220) : fallback;
}

export function errorMessage(error: unknown, fallback = GENERIC_ERROR_MESSAGE) {
  if (typeof error === "object" && error !== null) {
    const maybe = error as {
      userMessage?: string;
      response?: { data?: { message?: unknown } };
    };
    const fromInterceptor = safeUserMessage(maybe.userMessage, "");
    if (fromInterceptor) return fromInterceptor;
    const fromApi = safeUserMessage(maybe.response?.data?.message, "");
    if (fromApi) return fromApi;
  }
  return fallback;
}
