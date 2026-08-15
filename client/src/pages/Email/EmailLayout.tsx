import React, { useState, Suspense } from 'react';
import { Outlet, NavLink, useParams } from 'react-router-dom';
import { IconButton, Avatar, List, ListItemText, Button } from '@mui/material';
import { Menu as MenuIcon, Search, HelpOutline, SettingsOutlined, AppsOutlined, Add as AddIcon } from '@mui/icons-material';
import { SIDEBAR_DATA } from '../../config/sidebar.config';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader/Loader';
import ComposeMail from '../../components/ComposeMail';

export interface EmailOutletContext {
  openDrawer: boolean;
  sidebarWidth: number;
}

const EmailLayout: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const { user } = useAuth();
  const { type = '' } = useParams();
  const initial = user?.name?.trim().charAt(0).toUpperCase() || user?.email?.trim().charAt(0).toUpperCase() || '?';

  const toggleDrawer = () => setOpenDrawer((prev) => !prev);
  const sidebarWidth = openDrawer ? 256 : 64;

  return (
    <>
      <section className="flex w-full h-full bg-amber-200">
        <div className='flex bg-white w-[25%] h-full'>
          This is for the menu here got it
        </div>
        <div className='flex flex-col w-full h-full'>
          <div className='flex bg-white w-full h-[8vh]'>
              Testing  This filed will be for the header
          </div>
          <main className="transition-all" style={{ marginLeft: sidebarWidth, marginTop: 64, minHeight: 'calc(100vh - 64px)' }}>
            <Suspense fallback={<Loader />}>
              <Outlet context={{ openDrawer, sidebarWidth, selectedEmails, setSelectedEmails }} />
            </Suspense>
          </main>
        </div>
      </section>
    </>
  );
};

export default EmailLayout;
