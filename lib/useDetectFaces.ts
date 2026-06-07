'use client';

import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { getBaseURL } from '@/lib/utils';

export type FaceBox = {
  id: string;
  index?: number;
  confidence?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  pixelBox?: { x: number; y: number; width: number; height: number };
};

export type FaceDetectionResponse = {
  faceDetectionSessionId: string;
  imageWidth: number;
  imageHeight: number;
  faces: FaceBox[];
  expiresAt: string;
};

const detectFaces = async (file: File): Promise<FaceDetectionResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${getBaseURL()}/ai/faces/detect`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let message = `Face detection failed: ${response.statusText}`;
    try {
      const body = await response.json();
      if (body?.error) {
        message = body.error;
      }
    } catch {
      // Response body wasn't JSON; keep the default status text.
    }
    throw new Error(message);
  }

  return response.json();
};

export type DetectFacesMutation = UseMutationResult<FaceDetectionResponse, Error, File>;

// useDetectFaces wraps the POST /ai/faces/detect helper. The backend returns
// normalized face boxes plus a short-lived session ID we feed back into the
// final /upload payload so the runtime script reuses the same boxes the user
// saw in the overlay.
//
// We return the React Query mutation object directly because React Query
// guarantees referentially-stable methods, which keeps consuming useEffect
// dependency arrays well-behaved.
const useDetectFaces = (): DetectFacesMutation =>
  useMutation<FaceDetectionResponse, Error, File>({
    mutationFn: (file: File) => detectFaces(file),
  });

export default useDetectFaces;
