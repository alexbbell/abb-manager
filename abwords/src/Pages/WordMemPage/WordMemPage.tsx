// @flow

import { WordMemory } from '../../Components/WordMemory/WordMemory';
import { parseJwt } from '../../Helpers/AuthFunc';
import { ITokens } from '../../Data/interfaces';

export const WordMemPage = () => {

    const tokenString = localStorage.getItem('tokens') ?? ''
    const tokenObject:ITokens = JSON.parse(tokenString);
    console.log('token' ,  tokenObject)
    console.log( parseJwt(tokenObject.accessToken))

    return (
        <div>
            <WordMemory />
        </div>
    );
};