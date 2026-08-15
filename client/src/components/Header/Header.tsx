import React, { useState } from 'react';
import { AppBar, Toolbar, Box, InputBase, IconButton, Avatar, Badge, styled } from '@mui/material';
import { Menu as MenuIcon, Search, Tune, HelpOutline, SettingsOutlined, AppsOutlined } from '@mui/icons-material';
import Logo from '../../img/Email.svg';
import { useAuth } from '../../context/AuthContext';
import Profile from '../Profile/Profile';

const StyledAppBar = styled(AppBar)({
  background: '#ffffff',
  boxShadow: 'none',
  borderBottom: '1px solid #dadce0',
  position: 'fixed',
  width: '100%',
  zIndex: 1200,
});

const AvatarButton = styled(IconButton)({
  padding: 8,
});

const UserAvatar = styled(Avatar)({
  width: 32,
  height: 32,
  background: '#f3733b',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 500,
  cursor: 'pointer',
});

const SearchWrapper = styled(Box)({
  flex: 1,
  maxWidth: '720px',
  background: '#eaf1fb',
  borderRadius: '24px',
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  height: '48px',
  minHeight: '48px',
  transition: 'background-color 0.2s, box-shadow 0.2s',
  '&:focus-within': {
    background: '#ffffff',
    boxShadow: '0 1px 1px 0 rgba(65,69,73,0.3), 0 1px 3px 1px rgba(65,69,73,0.15)',
  },
});

const SearchInput = styled(InputBase)({
  flex: 1,
  marginLeft: '12px',
  fontSize: '16px',
  color: '#202124',
});

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
      <StyledAppBar>
        <Toolbar style={{ minHeight: 64, gap: '4px', display: 'flex' }}>
          <Box style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
            <IconButton onClick={toggleDrawer}>
              <MenuIcon color="action" />
            </IconButton>
            <img src={Logo} alt="logo" style={{ width: 32, height: 32, margin: '0 4px 0 8px', objectFit: 'contain' }} />
            <p style={{ color: '#5f6368', fontSize: '22px', fontWeight: 400, margin: 0, paddingTop: 2 }}>Email</p>
          </Box>

          <Box style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 16px' }}>
            <SearchWrapper>
              <Search color="action" />
              <SearchInput placeholder="Search mail" />
              <Tune color="action" />
            </SearchWrapper>
          </Box>

          <Box style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: '0 0 auto' }}>
            <IconButton><HelpOutline color="action" /></IconButton>
            <IconButton><SettingsOutlined color="action" /></IconButton>
            <IconButton><AppsOutlined color="action" /></IconButton>
            <AvatarButton onClick={onUserClick} style={{ marginLeft: 4 }}>
              <Badge color="success" variant="dot" overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <UserAvatar>{initial}</UserAvatar>
              </Badge>
            </AvatarButton>
          </Box>
        </Toolbar>
      </StyledAppBar>
      <Profile open={openDialog} onClose={handleCloseDialog} />
    </Box>
  );
};

export default Header;
