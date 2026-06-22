import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// URL-safe base64 encoding for /check/[encoded] shareable route.
// Uses - and _ instead of + and / so the string is safe in URL path segments.
export function encodeUrlParam(url: string): string {
  return btoa(url).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function decodeUrlParam(encoded: string): string {
  const padded = encoded + "=".repeat((4 - (encoded.length % 4)) % 4);
  return atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
}
