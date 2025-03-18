import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import './Logins.css'
import { dialogTheme } from '../../theme';
import { Box, Card, Checkbox, FormControlLabel, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface SignUpProps {
  open: boolean;
  handleClose: () => {

  };
}

interface IErrorDialog {
  open: boolean,
  errorText: string
}
const emptyErrorDialog:IErrorDialog = {
  open: false, errorText : ''
}
interface IFormRegister {
  email: string,
  password: string,
  confirmPassword: string,
  agreeTerms: boolean
}
interface IFormError {
  isError: boolean,
  errorText: string
}
// export default function SignUp({ open, handleClose }: SignUpProps) {
  export default function SignUp() {
  const [formRegister, setFormRegister] = React.useState<IFormRegister>( {
    email: '', password: '', confirmPassword: '', agreeTerms: true  })
  const [errorDialog, setErrorDialog] = React.useState<IErrorDialog>( emptyErrorDialog)
  
  
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  React.useEffect( () => {
    const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]');
    if (emailInput && emailInput.value) {
      const newValue = {...formRegister}
      newValue.email =  emailInput.value
      setFormRegister(newValue ); // Capture Chrome autofill
    }

  }, [])

  return (
    <Card variant="outlined" sx={{
      width: '350px', background: '#000', p: 1, color: '#FFF',
      display: 'flex',
      flexDirection: 'column',
      alignSelf: 'center',
      padding: '5px',
      boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    }}>

          <h1>SignUp</h1>
      <Box sx={ dialogTheme}>


        <TextField
          autoFocus
          required
          variant='standard'
          size='small'
          
          margin='none'
          defaultValue={formRegister.email}
          value={formRegister.email}
          onChange={ (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const newFormRegister = {...formRegister}
            newFormRegister.email = event.currentTarget.value
            setFormRegister(newFormRegister)
          }}
          id="email"
          name="email"
          label="Email address"
          aria-label='Email address'
          placeholder="Email address"
          type="email"
          title='Email address'
          helperText={ formRegister.email === '' ? 'Email is required' : ''}
          fullWidth
        />

    <TextField
          autoFocus
          required
          variant='standard'
          size='small'
          margin='none'
          value={formRegister.password}
          onChange={ (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const newFormRegister = {...formRegister}
            newFormRegister.password = event.currentTarget.value
            setFormRegister(newFormRegister)

          }}

          id="password"
          name="password"
          label="Password"
          aria-label='Password'
          placeholder="Password"
          type={showPassword ? "text" : "password"} 
                fullWidth
          slotProps={
            {
              input: {
                endAdornment: <InputAdornment position='end'>
                   <IconButton
          aria-label="toggle password visibility"
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
        >
          {showPassword ? <Visibility /> : <VisibilityOff />}</IconButton>
                </InputAdornment>
              }
            }
            
          }
          
        />

<TextField
          autoFocus
          required
          variant='standard'
          size='small'
          margin='none'
          value={formRegister.confirmPassword}
          onChange={ (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const newFormRegister = {...formRegister}
            newFormRegister.confirmPassword = event.currentTarget.value
            setFormRegister(newFormRegister)
          }}

          helperText={ formRegister.password !== formRegister.confirmPassword  ? 'Passwods must be equal' : ''}

          id="confirmPassword"
          name="confirmPassword"
          label="confirmPassword"
          aria-label='confirmPassword'
          placeholder="confirmPassword"
          type="password"
          fullWidth
        />

      <FormControlLabel
          sx={{
            background: '#000',
          }}
            control={
              <Checkbox
              sx={{
                color: 'pink'
              }}
              checked={formRegister.agreeTerms} onChange={() => {
                const newFormRegister = {...formRegister}
                newFormRegister.agreeTerms  = !formRegister.agreeTerms
                setFormRegister(newFormRegister )
              }} name="jason" />
            }
            label="I agree with the terms"
          />

      </Box>
      <Box>
        <Button onClick={() => console.log('cancel')}>Cancel</Button>
        <Button variant="contained" type="submit"
          sx={{
            ":root": {
                border: '#FFF 1px solid'
            }
          }}
          disabled={
              formRegister.email === '' ||
              formRegister.password !== formRegister.confirmPassword ||
              !formRegister.agreeTerms
           }
          onClick={() => {
            console.log('formRegister', formRegister)
            if(!formRegister.agreeTerms) {
              const newErrorDialog: IErrorDialog = {
                open: true, errorText: 'You must appove the terms'
              }
              setErrorDialog(newErrorDialog)
              return
            }
            if (formRegister.email === 'alexey@beliaeff.ru') {


            }
          }}>
          Register
        </Button>
      </Box>

      <Dialog open={errorDialog.open}
      onClose={ () => {
        setErrorDialog( { open: false, errorText: ''})
      }}>

          <DialogActions sx={{ pb: 3, px: 3 }}>
         </DialogActions>
         <DialogContent>
          <div>{errorDialog.errorText}</div>
         </DialogContent>
         <DialogActions>
         <Button onClick={() => {
          setErrorDialog(emptyErrorDialog)
         }}>Close</Button>

         </DialogActions>

      </Dialog>
    </Card>
  );
}