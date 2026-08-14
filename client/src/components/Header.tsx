import React, { useState } from 'react';
import { AppBar, Toolbar, Box, InputBase, IconButton, Avatar, Badge } from '@mui/material';
import { Menu as MenuIcon, Search, Tune, HelpOutline, SettingsOutlined, AppsOutlined } from '@mui/icons-material';
import Logo from '../img/Email.svg';
import Profile from './Profile';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  toggleDrawer: () => void;
}

const Header = ({ toggleDrawer }: HeaderProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuth();
  const initial = user?.name?.trim().charAt(0).toUpperCase() || user?.email?.trim().charAt(0).toUpperCase() || '?';

  const onUserClick = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <Box>
      <AppBar className="bg-white shadow-none border-b border-[#dadce0] fixed w-full z-[1200]">
        <Toolbar className="min-h-[64px] h-[64px] flex gap-[4px]">
          {/* Left: menu + logo */}
          <Box className="flex items-center flex-none">
            <IconButton onClick={toggleDrawer}>
              <MenuIcon color="action" />
            </IconButton>
            <img
              src={Logo}
              alt="logo"
              className="w-8 h-8 m-[0_4px_0_8px] object-contain"
            />
            <p className="m-0 text-[22px] font-normal text-gsubtext pt-[2px]">
              Email
            </p>
          </Box>

          {/* Center: search */}
          <Box className="flex-1 flex justify-center px-4">
            <div className="flex-1 max-w-[720px] bg-[#eaf1fb] rounded-[24px] flex items-center px-4 h-12 min-h-12 transition-all duration-200 focus-within:bg-white focus-within:shadow-[0_1px_1px_rgba(65,69,73,0.3),_0_1px_3px_1px_rgba(65,69,73,0.15)]">
              <Search color="action" />
              <InputBase
                placeholder="Search mail"
                className="flex-1 ml-3 text-base text-gtext"
              />
              <Tune color="action" />
            </div>
          </Box>

          {/* Right: icons + avatar */}
          <Box className="flex items-center gap-[4px] flex-none">
            <IconButton>
              <HelpOutline color="action" />
            </IconButton>
            <IconButton>
              <SettingsOutlined color="action" />
            </IconButton>
            <IconButton>
              <AppsOutlined color="action" />
            </IconButton>
            <IconButton onClick={onUserClick} className="ml-1 p-2">
              <Badge color="success" variant="dot" overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Avatar className="w-8 h-8 bg-[#f3733b] text-white text-[16px] font-medium cursor-pointer">
                  {initial}
                </Avatar>
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Profile open={openDialog} onClose={handleCloseDialog} />
    </Box>
  );
};

export default Header;