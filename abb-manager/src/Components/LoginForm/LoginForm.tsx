// @flow
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { emptyAuthParams, IAccount, ITokens } from '../../Data/interfaces';
import { ApiServices } from '../../Data/ApiServices';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link/Link';
import Card from '@mui/material/Card/Card';
import Typography from '@mui/material/Typography/Typography';
import ForgotPassword from './ForgotPassword';
import { Label } from '@mui/icons-material';
import SignUp from './SignUp';

export const LoginForm = () => {
    const navigate = useNavigate();

    const [authRequest, setAuthRequest] = React.useState<IAccount>(emptyAuthParams)
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [openForgot, setOpenForgot] = React.useState(false);
    const [openRegister, setOpenRegister] = React.useState(true);
    const [actionDisabled, setActionDisabled] = React.useState(false)

    const handleClickForgotOpen = () => {
      setOpenForgot(true);
    };
    const handleForgotClose = () => {
      setOpenForgot(false);
    };

    const handleClickRegisterOpen = () => {
      setOpenRegister(true);
    };
    const handleRegisterClose = () => {
      setOpenRegister(false);
    };

    type tLoginFields = 'login' | 'password'
    const apiServices = new ApiServices()

    const validateInputs = () => {
        let isValid = true;
        if (!authRequest.login || !/\S+@\S+\.\S+/.test(authRequest.login)) {
          setEmailError(true);
          setEmailErrorMessage('Please enter a valid email address.');
          isValid = false;
        } else {
          setEmailError(false);
          setEmailErrorMessage('');
        }

        if (!authRequest.password || authRequest.password.length < 6) {
          setPasswordError(true);
          setPasswordErrorMessage('Password must be at least 6 characters long.');
          isValid = false;
        } else {
          setPasswordError(false);
          setPasswordErrorMessage('');
        }

        return isValid;
      };

    const submitData = () => {
        if(! validateInputs) {
            return
        } else {
            apiServices.AuthLogin(authRequest)
            .then(res => {
                const tokens: ITokens = {accessToken: res.tokens?.accessToken??'', refreshToken: res.tokens?.refreshToken??''}
                localStorage.setItem('tokens', JSON.stringify(tokens))
                navigate('dashboard')
            }).catch(err => {
                console.log('err', err)
            })
        }
    }

    function inputLogin(field: tLoginFields, value: string): void {
        const newAuth = {...authRequest}
        switch(field) {
            case 'login':
                newAuth.login = value
            break
            case 'password':
                newAuth.password = value
            break
            default:
                console.error('Somethings wrong with code')
            break
        }
        setAuthRequest(newAuth)
    }

    return (
        <Card variant="outlined" sx={{
            width: '300px', background: '#000', p:1,
            display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',

    padding: '5px',
    boxShadow:
      'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',

            }}>
        LOGIN FORM

        <Box sx={{display: 'flex', flexDirection: 'column',  gap: '10px', }}>

            <FormControl>
            <TextField id='login' type='text' size='small' variant='standard' name='login'
                onChange={ (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                inputLogin('login', event.currentTarget.value)
            }} />
            </FormControl>

                <FormControl>
                    <Label >text</Label>
                    <TextField id='password' type='password' size='small' variant='standard' name='password'
                        onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            inputLogin('password', event.currentTarget.value)
                        }}/>
                    <Link
                        component="button"
                        type="button"
                        onClick={ handleClickForgotOpen}
                        variant="body2"
                        sx={{ alignSelf: 'baseline' }}>
                        Forgot your password?
                    </Link>
                </FormControl>

            <Button type='submit' size='small' variant='contained' color='primary'
            disabled={actionDisabled}
            onClick={ (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                event.preventDefault()
                submitData()
            } }>Login</Button>

<ForgotPassword open={openForgot} handleClose={ async () => handleForgotClose()} />
<SignUp open={openRegister} handleClose={ async () => handleRegisterClose()} />

<Typography sx={{ textAlign: 'center', color: '#FFF' }}>
          Don&apos;t have an account?{' '}
          <span>
            <Link
              href="/material-ui/getting-started/templates/sign-in/"
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Sign up
            </Link>
          </span>
        </Typography>
        </Box>
    </Card>
    );
};