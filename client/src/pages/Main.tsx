import { useState, Suspense } from 'react';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import Emails from '../components/Emails';
import { MailOutlineOutlined } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SuspenseLoader from '../components/common/SuspenseLoader';

const Main: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(true);
  const { user } = useAuth(); // Retrieve the user (from the DB) via AuthContext
  const userName = user?.name ?? '';

  const toggleDrawer = () => {
    setOpenDrawer((prevState) => !prevState);
  };

  return (
    <>
      <Header toggleDrawer={toggleDrawer} />
      <Box>
        <SideBar openDrawer={openDrawer} />
        <Suspense fallback={<SuspenseLoader />}>
          <Outlet context={{ openDrawer }} />
        </Suspense>
      </Box>
    </>
  );
};

export default Main;