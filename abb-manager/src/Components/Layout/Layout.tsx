// @flow
import { Box, Grid2 } from '@mui/material';
import * as React from 'react';
import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = () => {
    return (
        <div>
            <Header />
            <Box>
                <Grid2 container>
                    <Grid2 size={{ xs:0, md: 1}}></Grid2>
                    <Grid2 size={{ xs:12, md: 10}}>
                <Outlet />

                    </Grid2>
                    <Grid2 size={{ xs:0, md: 1}}></Grid2>

                </Grid2>
            </Box>
            <Footer />

        </div>
    );
};