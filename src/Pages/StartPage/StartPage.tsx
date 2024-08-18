// @flow
import * as React from 'react';
import { ITokens } from '../../Data/interfaces';
import { LoginForm } from '../../Components/LoginForm/LoginForm';


export const StartPage = () => {
    const [accessToken, setAccessToken] = React.useState('')
    React.useEffect( () => {
        const isTokenStr:string = localStorage.getItem('tokens')?? '{}'
        const tokens: ITokens = JSON.parse(isTokenStr)
        setAccessToken (tokens.accessToken)
    }, [])


    return (
   <>
    {
        accessToken === '' ? <LoginForm /> : <h1>Page for authenticated</h1>
    }
   </>
    );
};