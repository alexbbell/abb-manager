import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';

import './Logins.css'
import { dialogTheme } from '../../theme';
import { NightShelter } from '@mui/icons-material';
import { TextField } from '@mui/material';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => {

  };
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          console.log('event', event)
          handleClose();
        },

      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent sx={ dialogTheme}>
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a link to
          reset your password.
        </DialogContentText>

        <TextField
        sx={{ color: 'wheat',
            ":-ms-input-placeholder": {
              color: '#F0F'
            }

        }}
          autoFocus
          required
          variant='standard'
          size='small'
          margin='none'
          id="email"
          name="email"
          label="Email address"
          aria-label='Email address'
          placeholder="Email address"
          type="email"
          title='Email adress'
          fullWidth

        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}