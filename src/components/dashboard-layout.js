import React, { useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';
import { CorporateSidebar } from './corporate-sidebar';
import { CPODashboardSidebar } from './cpo-sidebar';
import { useRouter } from 'next/router';

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  [theme.breakpoints.up('mds')]: {
    paddingLeft: 280,
    paddingTop: 50
  },
  [theme.breakpoints.down('mds')]: {
    paddingTop: 64
  }
}));

export const DashboardLayout = (props) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('mds'), {
    defaultMatches: true,
    noSsr: false
  });
  const router = useRouter();
  const isCorporate = router.pathname.includes('corporate-partner');
  const isCPO = router.pathname.includes('partner');

  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      {<DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />}
      {isCPO && (
        <CPODashboardSidebar
          onClose={() => setSidebarOpen(false)}
          open={isSidebarOpen}
        />
      )}
      {isCorporate && (
        <CorporateSidebar
          onClose={() => setSidebarOpen(false)}
          open={isSidebarOpen}
        />
      )}
      {!isCorporate && !isCPO && (
        <DashboardSidebar
          onClose={() => setSidebarOpen(false)}
          open={isSidebarOpen}
        />
       )} 
    </>
  );
};
