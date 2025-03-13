// @flow
import * as React from 'react';
import { PostsList } from '../../Components/PostsList/PostsList';
import SignUp from '../../Components/LoginForm/SignUp';
type Props = {

};
export const SignupPage = (props: Props) => {
    return (
        <div>
            <h1>Signup</h1>
            <SignUp  />
        </div>
    );
};