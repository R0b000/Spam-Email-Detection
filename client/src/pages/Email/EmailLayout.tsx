import React, { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../../components/Header/Header';
import SideBar from '../../components/Menu/Sidebar';
import MiniSideBar from '../../components/Menu/MiniSideBar';
import Loader from '../../components/Loader/Loader';

export interface EmailOutletContext {
  openDrawer: boolean;
  sidebarWidth: number;
}

const EmailLayout: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(true);

  const toggleDrawer = () => setOpenDrawer((prev) => !prev);

  const sidebarWidth = openDrawer ? 256 : 64;

  return (
    <>
      <Header toggleDrawer={toggleDrawer} />
      <Box>
        {openDrawer ? <SideBar openDrawer={openDrawer} /> : <MiniSideBar />}
        <Suspense fallback={<Loader />}>
          <Outlet context={{ openDrawer, sidebarWidth }} />
        </Suspense>
      </Box>
    </>
  );
};

export default EmailLayout;
