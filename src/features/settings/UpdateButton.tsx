import { Button } from '@mui/material';

import { type UpdateButtonProps } from './types';

const UpdateButton = ({ updateUsername }: UpdateButtonProps) => {
  return (
    <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={() => updateUsername()}>
      Update
    </Button>
  );
};

export default UpdateButton;
