import { Container, Box, Typography, Stack, Paper, CircularProgress, Alert } from '@mui/material';
import { GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

import githubIcon from '../assets/github-icon.svg';
import googleIcon from '../assets/google-icon.svg';
import ProviderSignInButton from '../components/ProviderSignInButton';
import { useAuthState } from '../hooks/useAuthState';
import { backgroundContainer, title, paper, alert } from '../styles/styles';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const LoginPage = () => {
  const { authing, error, buttonProps } = useAuthState();

  return (
    <Container sx={backgroundContainer}>
      <Box>
        <Typography sx={title}>AURORA</Typography>
        <Paper sx={paper}>
          <Stack spacing={2}>
            <ProviderSignInButton
              text="Continue with Google"
              image={googleIcon}
              authProvider={googleProvider}
              {...buttonProps}
            />
            <ProviderSignInButton
              text="Continue with GitHub"
              image={githubIcon}
              authProvider={githubProvider}
              {...buttonProps}
            />
          </Stack>
        </Paper>

        {authing && <CircularProgress size={20} thickness={4} />}
        {error && (
          <Alert severity="error" sx={alert}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default LoginPage;
