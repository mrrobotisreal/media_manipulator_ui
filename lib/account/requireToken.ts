import { getCurrentIdToken } from '@/lib/firebase';

/** The signed-in caller's ID token, or a thrown error when nobody is signed in. */
export async function requireToken(): Promise<string> {
  const token = await getCurrentIdToken();
  if (!token) throw new Error('Not signed in');
  return token;
}
