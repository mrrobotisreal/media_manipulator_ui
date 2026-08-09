'use client'; // Error boundaries must be Client Components

// Shared implementation in components/route-error.tsx — both root layout
// groups mount the same boundary so error containment is identical everywhere.
export { default } from '@/components/route-error';
