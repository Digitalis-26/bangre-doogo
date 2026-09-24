import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Deterministic date formatting that outputs identically on SSR and Client
 * Avoids React hydration mismatch across locales and timezones.
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return String(dateString || '');
  }
}

export function formatDateNice(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    const day = d.getDate();
    const month = months[d.getMonth()] || '';
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return String(dateString || '');
  }
}

export function formatTime(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return String(dateString || '');
  }
}
