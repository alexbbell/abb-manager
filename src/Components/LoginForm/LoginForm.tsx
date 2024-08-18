// @flow
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { emptyAuthParams, IAccount, ITokens } from '../../Data/interfaces';
import { ApiServices } from '../../Data/ApiServices';
import Button from '@mui/material/Button';

export const LoginForm = () => {

    const [authRequest, setAuthRequest] = React.useState<IAccount>(emptyAuthParams)
    type tLoginFields = 'login' | 'password'
    const apiServices = new ApiServices()
    const submitData = () => {

        apiServices.AuthLogin(authRequest)
        .then(res => {
            const tokens: ITokens = {accessToken: res.tokens?.accessToken??'', refreshToken: res.tokens?.refreshToken??''}
            localStorage.setItem('token', JSON.stringify(tokens))
        }).catch(err => {
            console.log('err', err)
        })
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
        <div>
        LOGIN FORM

        <Box sx={{display: 'flex', flexDirection: 'column', width: '250px', gap: '10px'}}>
            <TextField id='login' type='text' size='small' variant='standard' name='login'
            onChange={ (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                inputLogin('login', event.currentTarget.value)
                }
             } />

            <TextField id='password' type='password' size='small' variant='standard' name='password'
                onChange={ (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    inputLogin('password', event.currentTarget.value)
                }}
            />
            <Button type='submit' size='small' variant='contained' color='primary'
            onClick={ (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                event.preventDefault()
                submitData()

            } }

            >Login</Button>
        </Box>
    </div>
    );
};