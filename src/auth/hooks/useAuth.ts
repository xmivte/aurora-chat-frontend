import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState, useContext } from 'react';
import { NavigateFunction } from 'react-router-dom';

import { UserCxt } from '@/main';

const LAST_SIGN_IN_LIMIT = 30 * 24 * 60 * 60 * 1000; // a month in milliseconds

import { createUser, fetchUser } from '@/features/settings/userApi';
import { type UserDataDto } from '@/features/settings/types';

export const useAuth = (navigate: NavigateFunction) => {
  const auth = getAuth();
  const { setUser } = useContext(UserCxt)!;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      const handleUser = async () => {
        if (!user) {
          void navigate('/login');
          setLoading(false);
          return;
        }

        const lastSignInTime = user.metadata.lastSignInTime;
        // checks if last sign in time exists
        if (!lastSignInTime) {
          await signOut(auth);
          void navigate('/login');
          setLoading(false);
          return;
        }

        const lastSignIn = new Date(lastSignInTime).getTime();

        //checks if last sign in time is not older than the limit
        if (Date.now() - lastSignIn > LAST_SIGN_IN_LIMIT) {
          await signOut(auth);
          void navigate('/login');
          setLoading(false);
          return;
        }

        const userData: UserDataDto = {
          username: user.displayName || 'Unknown',
          image: user.photoURL || '',
        };

        try {
          let data: UserDataDto;
          try {
            data = await fetchUser();
          } catch {
            data = await createUser(userData);
          }

          setUser(data);
        } catch (err) {
          console.error('Failed to fetch or create user:', err);
        } finally {
          setLoading(false);
        }
      };

      void handleUser();
    });

    return () => unsubscribe();
  }, [auth, navigate, setUser]);

  return { loading };
};
