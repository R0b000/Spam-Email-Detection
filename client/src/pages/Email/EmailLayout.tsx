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
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#dadce0] flex items-center px-4 z-[1200]">
        <IconButton onClick={toggleDrawer} aria-label="Toggle menu">
          <MenuIcon className="text-[#5f6368]" />
        </IconButton>

        <div className="w-8 h-8 mx-1 ml-2 flex items-center">
          <img src="/email.svg" alt="logo" className="w-8 h-8 object-contain" />
        </div>
        <span className="text-[#5f6368] text-[22px] font-normal ml-1 pt-0.5">Email</span>

        <div className="flex-1 max-w-[720px] bg-[#eaf1fb] rounded-full flex items-center px-4 h-12 mx-4 transition-all focus-within:bg-white focus-within:shadow-[0_1px_1px_0_rgba(65,69,73,0.3),0_1px_3px_1px_rgba(65,69,73,0.15)]">
          <Search className="text-[#5f6368]" />
          <input
            type="text"
            placeholder="Search mail"
            className="flex-1 ml-3 text-base text-gtext border-none bg-transparent outline-none"
          />
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <IconButton aria-label="Help"><HelpOutline className="text-[#5f6368]" /></IconButton>
          <IconButton aria-label="Settings"><SettingsOutlined className="text-[#5f6368]" /></IconButton>
          <IconButton aria-label="Apps"><AppsOutlined className="text-[#5f6368]" /></IconButton>
          <IconButton className="ml-1" aria-label="Profile">
            <Avatar className="w-8 h-8 text-white text-base font-medium cursor-pointer" style={{ background: '#f3733b' }}>{initial}</Avatar>
          </IconButton>
        </div>
      </header>

      {openDrawer ? (
        <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-white border-r border-[#dadce0] overflow-y-auto py-2 z-[1100]">
          <Button
            onClick={() => setOpenDialog(true)}
            className="bg-[#c2e7ff] text-[#001d35] p-4 rounded-2xl min-w-[140px] w-[140px] text-sm font-medium shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex justify-center gap-3 mx-2 mb-2 hover:bg-[#b6dcfb] hover:shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
          >
            <AddIcon style={{ fontSize: 28 }} />
            Compose
          </Button>

          <List className="p-0">
            {SIDEBAR_DATA.map((data) => {
              const isActive = type.toLowerCase() === data.name;
              return (
                <NavLink key={data.name} to={`/emails/${data.name}`} className="no-underline">
                  <div className={`flex items-center min-h-8 rounded-r-2xl pr-3 cursor-pointer text-sm font-medium text-[#202124] mb-0.5 ${
                    isActive ? 'bg-[#d3e3fd] font-bold' : 'hover:bg-[rgba(60,64,67,0.08)]'
                  }`}>
                    <span className="min-w-[48px] pl-3 inline-flex items-center justify-center text-[#001d35] [&_.MuiSvgIcon-root]:text-[20px]">
                      <data.icon />
                    </span>
                    <ListItemText primary={data.title} className="nav-title text-[#202124]" />
                  </div>
                </NavLink>
              );
            })}
          </List>

          <ComposeMail openDialog={openDialog} setOpenDialog={setOpenDialog} />
        </aside>
      ) : (
        <aside className="fixed top-16 left-0 w-16 h-[calc(100vh-64px)] bg-white border-r border-[#dadce0] flex flex-col items-center pt-2 z-[1100]">
          <div className="w-8 h-8 mb-3">
            <img src="/email.svg" alt="Email" className="w-8 h-8 object-contain" />
          </div>
          {SIDEBAR_DATA.map((data) => (
            <NavLink key={data.name} to={`/emails/${data.name}`}>
              {({ isActive }) => (
                <IconButton
                  className={`w-12 h-10 min-h-10 rounded-r-2xl p-0 flex items-center justify-center text-[#5f6368] ${
                    isActive ? 'bg-[#d3e3fd] [&_.MuiSvgIcon-root]:text-[#1a73e8]' : 'hover:bg-[rgba(60,64,67,0.08)]'
                  }`}
                  aria-label={data.title}
                >
                  <data.icon style={{ fontSize: 22 }} />
                </IconButton>
              )}
            </NavLink>
          ))}
        </aside>
      )}

      <main className="transition-all" style={{ marginLeft: sidebarWidth, marginTop: 64, minHeight: 'calc(100vh - 64px)' }}>
        <Suspense fallback={<Loader />}>
          <Outlet context={{ openDrawer, sidebarWidth, selectedEmails, setSelectedEmails }} />
        </Suspense>
      </main>
    </>
  );
};

export default EmailLayout;
