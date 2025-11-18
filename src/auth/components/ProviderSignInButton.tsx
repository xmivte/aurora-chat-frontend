import Button from '@mui/material/Button';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { auth } from '@/firebase';

import { providerSignInButton } from '../styles/styles';

interface ProviderSignInButtonProps {
  text: string;
  image: string;
  authProvider: GoogleAuthProvider | GithubAuthProvider;
  disabled: boolean;
  onAuthStart: () => void;
  onAuthError: (error: string) => void;
}

const ProviderSignInButton = ({
  text,
  image,
  authProvider,
  disabled,
  onAuthStart,
  onAuthError,
}: ProviderSignInButtonProps) => {
  const navigate = useNavigate();

  const signInWithProvider = async () => {
    try {
      onAuthStart();
      await signInWithPopup(auth, authProvider);
      void navigate('/');
    } catch (err) {
      onAuthError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  return (
    <Button
      sx={providerSignInButton}
      startIcon={<img src={image} alt={text} />}
      onClick={() => void signInWithProvider()}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

export default ProviderSignInButton;
