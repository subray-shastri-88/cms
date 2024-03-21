import React from 'react';
import {
    Box,
    Container,
} from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import Service from 'src/components/support/serviceRequest';
import compose from '../utils/compose';
import { auth } from '../utils/ssrUtils';

const SupportManagement = () => {
    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                py: 3
            }}
        >
            <Container maxWidth="xl">
                < Service />
            </Container>
        </Box>
    );
};

SupportManagement.getLayout = (page) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export default SupportManagement;

export const getServerSideProps = compose(auth);
