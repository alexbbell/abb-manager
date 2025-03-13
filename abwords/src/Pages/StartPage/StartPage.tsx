// @flow
import * as React from 'react';
import { ITokens } from '../../Data/interfaces';
import { LoginForm } from '../../Components/LoginForm/LoginForm';
import { Dashboard } from '../Dashboard/Dashboard';
//import { jwtDecode } from 'jwt-decode' // import dependency
//import * as dayjs from 'dayjs'

export const StartPage = () => {
    //const dayjs = require('dayjs')
    const [accessToken, setAccessToken] = React.useState('')

    React.useEffect( () => {
        const isTokenStr:string = localStorage.getItem('tokens')?? '{}'
        const tokens: ITokens = JSON.parse(isTokenStr)
        console.log('isTokenStr', tokens)
        try {
            if(tokens.accessToken) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                //const jwt:any = jwtDecode(tokens.accessToken)
                //const dexp = dayjs(jwt.exp).format()
                //console.log(jwt.exp, dexp)
                setAccessToken (tokens.accessToken)
            }
        } catch (err) {
            console.error(err)
        }


    }, [accessToken])


    return (
   <>
    {
        !accessToken || accessToken === '' ? <LoginForm /> :
        <>
            <h1>Page for authenticated</h1>
            <Dashboard />

        </>
    }
    { accessToken }
   </>
    );
};