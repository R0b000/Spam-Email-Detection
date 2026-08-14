import { useState, Suspense } from 'react';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import MiniSideBar from '../components/MiniSideBar';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SuspenseLoader from '../components/common/SuspenseLoader';

export interface MainOutletContext {
  openDrawer: boolean;
  sidebarWidth: number;
}

const Main: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(true);
  const { user } = useAuth();

  const toggleDrawer = () => setOpenDrawer((prev) => !prev);

  const sidebarWidth = openDrawer ? 256 : 64;

  return (
    <>
      <Header toggleDrawer={toggleDrawer} />
      <Box>
        {openDrawer ? <SideBar openDrawer={openDrawer} /> : <MiniSideBar />}
        <Suspense fallback={<SuspenseLoader />}>
          <Outlet context={{ openDrawer, sidebarWidth }} />
        </Suspense>
      </Box>
    </>
  );
};

export default Main;