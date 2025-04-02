import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import './Logins.css'
import { dialogTheme } from '../../theme';
import { Box, Card, Checkbox, FormControlLabel, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IFormRegister } from '../WordMemory/data';
import { ApiServices } from '../../Data/ApiServices';

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


interface IFormError {
  isError: boolean,
  errorText: string
}
// export default function SignUp({ open, handleClose }: SignUpProps) {
  export default function SignUp() {
  const apiServices = new ApiServices()
  const [formRegister, setFormRegister] = React.useState<IFormRegister>( {
    email: 'guest@guest.de', password: 'Ab123456$', confirmPassword: 'Ab123456$', agreeTerms: true  })
  const [errorDialog, setErrorDialog] = React.useState<IErrorDialog>( emptyErrorDialog)
  
  
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  React.useEffect( () => {

    // setTimeout(() => {
    //   const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]');
    //   if (emailInput && emailInput.value) {
    //     const newValue = {...formRegister}
    //     newValue.email =  emailInput.value
    //     setFormRegister(newValue ); // Capture Chrome autofill
        
    //   }
      
    // },1500);

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
      <form noValidate>


        <TextField
          autoFocus
          required
          variant='standard'
          size='small' 


          margin='none'
          value={formRegister.email}
          onChange={ (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const newFormRegister = {...formRegister}
            newFormRegister.email = event.currentTarget.value
            setFormRegister(newFormRegister)
          }}
          
          label="Email address"
          aria-label='Email address'
          placeholder="Email address"
          type="email"
          title='Email address'
          helperText={ formRegister.email === '' ? 'Email is required' : ''}
          fullWidth
        />
</form>
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
          label="Confirm Password"
          aria-label='Confirm Password'
          placeholder="Confirm Password"
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
          onClick={async () => {
            console.log('formRegister', formRegister)
            if(!formRegister.agreeTerms) {
              const newErrorDialog: IErrorDialog = {
                open: true, errorText: 'You must appove the terms'
              }
              setErrorDialog(newErrorDialog)
              return
            }
            
            const response = await apiServices.RegisterUser(formRegister)
            if(!response.isError ) {
              console.log(`it's ok`)
            } else {
              console.log(`${response.errorText}`) 
              const newErrorDialog: IErrorDialog = {
                open: true, errorText: `${response.errorText}`
              }
              setErrorDialog(newErrorDialog)
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