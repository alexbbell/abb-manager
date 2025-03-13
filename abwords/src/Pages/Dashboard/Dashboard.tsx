// @flow
import * as React from 'react';
import { PostsList } from '../../Components/PostsList/PostsList';
type Props = {

};
export const Dashboard = (props: Props) => {
    return (
        <div>
            <h1>Dashboard</h1>
            <PostsList />
        </div>
    );
};