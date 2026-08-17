import React, { useState, Suspense } from 'react';
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Box,
} from '@mui/material';
import type { SxProps } from '@mui/material';
import {
  Add as AddIcon,
  AppsOutlined,
  HelpOutline,
  MailOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ManageAccountsOutlined,
  LogoutOutlined,
} from '@mui/icons-material';
import { SIDEBAR_DATA } from '../../config/sidebar.config';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader/Loader';
import ComposeMail from '../../components/ComposeMail';
import axios from 'axios';

export interface EmailOutletContext {
  openDrawer: boolean;
  sidebarWidth: number;
}

// Shared styles so the Compose button and the sidebar list items look like
// part of the same cohesive group.
const sidebarItemSx: SxProps = {
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  borderRadius: '24px',
  mx: 1.5,
  my: 0.25,
  px: 2.5,
  py: 0.85,
  color: '#444746',
  '&:hover': {
    backgroundColor: '#f1f3f4',
    color: '#1f1f1f',
  },
  '&.Mui-selected': {
    backgroundColor: '#d3e3fd',
    color: '#041e49',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: '#d3e3fd',
    },
    '& .MuiListItemIcon-root': {
      color: '#041e49',
    },
  },
};

const composeButtonSx = (openDrawer: boolean) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  borderRadius: '16px',
  backgroundColor: '#c2e7ff',
  color: '#001d35',
  padding: openDrawer ? '16px 24px' : '16px',
  margin: '12px 12px 16px',
  minWidth: openDrawer ? '130px' : '48px',
  height: '56px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#b3dbf7',
    boxShadow: '0 4px 6px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.08)',
  },
});

const EmailLayout: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const { user, logout } = useAuth();
  const { type = '' } = useParams();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const initial =
    user?.name?.trim().charAt(0).toUpperCase() ||
    user?.email?.trim().charAt(0).toUpperCase() ||
    '?';

  const toggleDrawer = () => setOpenDrawer((prev) => !prev);
  const sidebarWidth = openDrawer ? 256 : 64;

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      logout();
      handleMenuClose();
      navigate('/auth/login');
    }
  };

  return (
    <>
      {/* Top app bar */}
      <header className="fixed top-0 left-0 z-30 flex h-16 w-full items-center gap-3 bg-[#f6f8fc] px-4 border-b border-[#dadce0]/60">
        <div className="flex w-[15vw] shrink-0 items-center pl-2">
          <IconButton
            size="small"
            onClick={toggleDrawer}
            aria-label="Toggle navigation"
            className="text-gsubtext hover:bg-gray-200/60"
          >
            <MenuIcon />
          </IconButton>
        </div>
        <div className='flex w-[85vw] pr-4 items-center justify-between'>
          <div className="flex items-center gap-1.5">
            <img src='/src/img/Email.svg' alt='Email Logo' className="h-8 w-8" />
          </div>

          {/* Search */}
          <div className="min-w-[45vw]">
            <div className="flex w-full max-w-2xl items-center rounded-full bg-[#eaf1fb] px-4 py-1.5 transition-all focus-within:bg-white focus-within:shadow-sm border border-transparent focus-within:border-[#dadce0]">
              <Search className="text-gsubtext mr-2" />
              <input
                type="search"
                placeholder="Search mail"
                className="w-full border-0 bg-transparent py-1 text-sm text-gtext outline-none placeholder-gsubtext"
              />
            </div>
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-1">
            <IconButton size="small" aria-label="App launcher" className="text-gsubtext hover:bg-gray-200/60">
              <AppsOutlined />
            </IconButton>
            <IconButton size="small" aria-label="Help" className="text-gsubtext hover:bg-gray-200/60">
              <HelpOutline />
            </IconButton>
            <IconButton size="small" aria-label="Settings" className="text-gsubtext hover:bg-gray-200/60">
              <SettingsOutlined />
            </IconButton>
            <Avatar
              onClick={handleAvatarClick}
              sx={{
                cursor: 'pointer',
                width: 30,
                height: 30,
                fontSize: '0.825rem',
                fontWeight: 600,
                bgcolor: 'var(--color-brand-blue)',
                transition: 'all 0.15s ease',
                '&:hover': {
                  opacity: 0.9,
                  boxShadow: '0 0 0 3px rgba(26,115,232,0.15)',
                },
              }}
              className="ml-2"
            >
              {initial}
            </Avatar>
          </div>
        </div>
      </header>

      {/* Compose mail dialog */}
      <ComposeMail openDialog={openDialog} setOpenDialog={setOpenDialog} />

      {/* Collapsible navigation menu */}
      <nav
        className="fixed top-16 py-3 bottom-0 left-0 z-20 flex flex-col bg-[#f6f8fc] border-r border-[#dadce0]/40 transition-all"
        style={{ width: sidebarWidth }}
      >
        <Button
          onClick={() => setOpenDialog(true)}
          sx={composeButtonSx(openDrawer)}
        >
          {openDrawer ? (
            <>
              <AddIcon sx={{ mr: 1.5 }} />
              <span>Compose</span>
            </>
          ) : (
            <AddIcon />
          )}
        </Button>
        <List sx={{ px: 0 }}>
          {SIDEBAR_DATA.map((item) => {
            const Icon = item.icon;
            const selected = type === item.name;
            return (
              <ListItemButton
                key={item.name}
                component={NavLink}
                to={`/emails/${item.name}`}
                selected={selected}
                sx={{
                  ...sidebarItemSx,
                  justifyContent: openDrawer ? 'flex-start' : 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: openDrawer ? 2 : 0,
                    color: selected ? '#041e49' : '#444746',
                  }}
                >
                  <Icon fontSize="small" />
                </ListItemIcon>
                {openDrawer && <ListItemText primary={item.title} sx={{ '& .MuiTypography-root': { fontWeight: selected ? 600 : 500 } }} />}
              </ListItemButton>
            );
          })}
        </List>
      </nav>

      {/* Main content */}
      <main
        className="transition-all bg-[#f6f8fc]"
        style={{ marginTop: 64, minHeight: 'calc(100vh - 64px)' }}
      >
        <Suspense fallback={<Loader />}>
          <Outlet context={{ openDrawer, sidebarWidth, selectedEmails, setSelectedEmails }} />
        </Suspense>
      </main>

      {/* Account Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openMenu}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
            mt: 1.5,
            width: 320,
            borderRadius: '16px',
            padding: '16px',
            backgroundColor: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1.5 }}>
          {/* Large Avatar */}
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'var(--color-brand-blue)',
              fontSize: '1.5rem',
              fontWeight: 600,
              mb: 1.5,
            }}
          >
            {initial}
          </Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#202124', mb: 0.25 }}>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#5f6368', mb: 2 }}>
            {user?.email || ''}
          </Typography>

          <Button
            variant="outlined"
            startIcon={<ManageAccountsOutlined />}
            sx={{
              textTransform: 'none',
              borderRadius: '24px',
              borderColor: '#dadce0',
              color: '#1a73e8',
              fontWeight: 600,
              fontSize: '0.85rem',
              px: 3,
              py: 0.75,
              '&:hover': {
                backgroundColor: '#f6f8fc',
                borderColor: '#1a73e8',
              },
            }}
          >
            Manage your Account
          </Button>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <MenuItem
          onClick={handleMenuClose}
          sx={{
            py: 1,
            borderRadius: '8px',
            '&:hover': { backgroundColor: '#f5f5f5' },
          }}
        >
          <ListItemIcon>
            <SettingsOutlined fontSize="small" sx={{ color: '#5f6368' }} />
          </ListItemIcon>
          <ListItemText primary="Account settings" sx={{ '& .MuiTypography-root': { fontSize: '0.875rem', color: '#202124', fontWeight: 500 } }} />
        </MenuItem>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center', p: 0.5 }}>
          <Button
            onClick={handleLogout}
            variant="outlined"
            startIcon={<LogoutOutlined />}
            sx={{
              textTransform: 'none',
              borderRadius: '24px',
              borderColor: '#d93025',
              color: '#d93025',
              fontWeight: 600,
              fontSize: '0.85rem',
              px: 4,
              py: 0.75,
              width: '100%',
              '&:hover': {
                backgroundColor: '#fce8e6',
                borderColor: '#d93025',
              },
            }}
          >
            Sign out
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default EmailLayout;
