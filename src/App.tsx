import { Container } from '@mui/material';

import { LogoutButton } from './auth';
import { backgroundContainer } from './auth/styles/styles';

function App() {
  return (
    <Container sx={backgroundContainer}>
      <LogoutButton />
    </Container>
  );
}

export default App;
