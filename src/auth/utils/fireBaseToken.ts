import { getAuth } from 'firebase/auth';

export async function getToken(): Promise<string | null> {
  const auth = getAuth();
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;
  return token;
}
