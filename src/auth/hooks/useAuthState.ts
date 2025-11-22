import { useState } from 'react';

export const useAuthState = () => {
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState('');

  const handleAuthStart = () => {
    setAuthing(true);
    setError('');
  };

  const handleAuthError = (errorMessage: string) => {
    setError(errorMessage);
    setAuthing(false);
  };

  return {
    authing,
    error,
    buttonProps: {
      disabled: authing,
      onAuthStart: handleAuthStart,
      onAuthError: handleAuthError,
    },
  };
};
