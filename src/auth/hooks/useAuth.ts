import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { NavigateFunction } from 'react-router-dom';

const LAST_SIGN_IN_LIMIT = 30 * 24 * 60 * 60 * 1000; // a month in milliseconds

export const useAuth = (navigate: NavigateFunction) => {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const lastSignInTime = user.metadata.lastSignInTime;
        // checks if last sign in time exists
        if (!lastSignInTime) {
          void signOut(auth);
          void navigate('/login');
          return;
        }

        const lastSignIn = new Date(lastSignInTime).getTime();

        //checks if last sign in time is not older than the limit
        if (Date.now() - lastSignIn > LAST_SIGN_IN_LIMIT) {
          void signOut(auth);
          void navigate(''); //void navigate('');
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
        void navigate(''); //void navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  return { loading };
};
