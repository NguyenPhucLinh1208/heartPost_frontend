import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ApiErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export function parseApiError(error: any): string {
  if (error && typeof error === 'object' && error.detail) {
    if (Array.isArray(error.detail)) {
      // FastAPI validation error format
      return error.detail.map((err: ApiErrorDetail) => {
        const loc = err.loc.join(' -> ');
        return `${loc}: ${err.msg}`;
      }).join('; ');
    } else if (typeof error.detail === 'string') {
      // Simple string error detail
      return error.detail;
    }
  }
  // Fallback for unexpected error formats
  return error.message || 'An unexpected error occurred.';
}