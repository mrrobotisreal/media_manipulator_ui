import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// File type detection
export const getFileType = (file: File): 'image' | 'video' | 'audio' | 'unknown' => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  return 'unknown';
};

const API_BASE_URL = import.meta.env.VITE_NODE_ENV === 'production'
  ? import.meta.env.VITE_API_BASE_URL
  // : 'http://192.168.4.74:8080/api';
  : 'http://localhost:8080/api';

export const getBaseURL = () => {
  return API_BASE_URL;
};
