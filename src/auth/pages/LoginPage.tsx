import { GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

import githubIcon from '../assets/github-icon.svg';
import googleIcon from '../assets/google-icon.svg';
import ProviderSignInButton from '../components/ProviderSignInButton';
import { useAuthState } from '../hooks/useAuthState';

const LoginPage = () => {
  const { authing, error, buttonProps } = useAuthState();

  return (
    <div className="wrapper">
      <h1>AURORA</h1>
      <div className="login-card">
        <ProviderSignInButton
          text="Continue with Google"
          image={googleIcon}
          authProvider={new GoogleAuthProvider()}
          {...buttonProps}
        />
        <ProviderSignInButton
          text="Continue with GitHub"
          image={githubIcon}
          authProvider={new GithubAuthProvider()}
          {...buttonProps}
        />
      </div>

      {authing && <span className="loader"></span>}
      {error && <div>{error}</div>}
    </div>
  );
};

export default LoginPage;
