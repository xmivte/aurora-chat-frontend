import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState, useContext } from 'react';
import { NavigateFunction } from 'react-router-dom';

import { storeDeviceIdentityKeyPair } from '@/features/encryption/keyPairs';
import { type UserDataDto } from '@/features/settings/types';
import { createUser, fetchUser } from '@/features/settings/userApi';
import { UserCxt } from '@/main';

const LAST_SIGN_IN_LIMIT = 30 * 24 * 60 * 60 * 1000; // a month in milliseconds

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
        if (!lastSignInTime) {
          await signOut(auth);
          void navigate('/login');
          setLoading(false);
          return;
        }

        const lastSignIn = new Date(lastSignInTime).getTime();
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

          try {
            await storeDeviceIdentityKeyPair(user.uid);
          } catch (e) {
            console.error('Failed to initialize/publish device identity keys', e);
          }
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
