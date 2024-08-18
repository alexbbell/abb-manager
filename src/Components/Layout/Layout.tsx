// @flow
import { Box } from '@mui/material';
import * as React from 'react';
import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = () => {
    return (
        <div>
            <Header />
            <Box>
                <Outlet />
            </Box>
            <Footer />

        </div>
    );
};