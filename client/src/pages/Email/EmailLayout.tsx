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
  Badge,
} from '@mui/material';
import type { SxProps } from '@mui/material';
import {
  Add as AddIcon,
  AppsOutlined,
  ChatBubbleOutline,
  HelpOutline,
  MailOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ManageAccountsOutlined,
  LogoutOutlined,
  VideocamOutlined,
  NotificationsOutlined,
  Close,
} from '@mui/icons-material';
import { SIDEBAR_DATA } from '../../config/sidebar.config';
import { useAuth } from '../../context/AuthContext';
import type { Mail } from '../../Model/ResponseModel/EmailModel/EmailResponseModel';
import Loader from '../../components/Loader/Loader';
import ComposeMail from '../../components/ComposeMail';
import httpClient from '../../Configuration/axios';
import Logo from '../../img/Email.svg';

export interface EmailOutletContext {
  openDrawer: boolean;
  sidebarWidth: number;
}

// Nav sidebar item styles
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

// Compose button styles
const composeButtonSx = {
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  borderRadius: '16px',
  backgroundColor: '#c2e7ff',
  color: '#001d35',
  padding: '16px 24px',
  margin: '12px 12px 16px',
  minWidth: '130px',
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
};

// Icon rail item styles
const iconRailItemSx = (active: boolean): SxProps => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
  py: 1,
  px: 1,
  mx: 'auto',
  mb: 0.5,
  borderRadius: '16px',
  cursor: 'pointer',
  width: '56px',
  backgroundColor: active ? '#d3e3fd' : 'transparent',
  color: active ? '#041e49' : '#444746',
  '&:hover': {
    backgroundColor: active ? '#d3e3fd' : '#e8eaed',
  },
});

const EmailLayout: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 768 : true;
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [composeParams, setComposeParams] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [userRole, setUserRole] = useState<string>('user');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEmailsList, setSearchEmailsList] = useState<Mail[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const { type = '' } = useParams();
  const navigate = useNavigate();

  const triggerSearch = (queryVal: string) => {
    setShowDropdown(false);
    navigate(`/emails/search?q=${encodeURIComponent(queryVal)}`);
  };

  const handleSearchChange = async (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchEmailsList([]);
      setShowDropdown(false);
      return;
    }
    try {
      const userEmail = user?.email;
      if (!userEmail) return;
      const response = await httpClient.get(`/search-emails?userEmail=${userEmail}&query=${val}`);
      const data = response.data as { data: Mail[] };
      setSearchEmailsList(data.data || []);
      setShowDropdown(true);
    } catch (err) {
      console.error('Error fetching search results:', err);
    }
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const initial =
    user?.name?.trim().charAt(0).toUpperCase() ||
    user?.email?.trim().charAt(0).toUpperCase() ||
    '?';

  const fetchUnreadCount = React.useCallback(async () => {
    try {
      const userEmail = user?.email;
      if (!userEmail) return;
      const response = await httpClient.get(`/unread-count?userEmail=${userEmail}`);
      const data = response.data as { count: number; role: string };
      setUnreadCount(data.count || 0);
      setUserRole(data.role || 'user');
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [user?.email]);

  React.useEffect(() => {
    fetchUnreadCount();

    // Poll every 5 seconds
    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchUnreadCount]);

  // Reset search when folder route changes
  React.useEffect(() => {
    setSearchQuery('');
    setSearchEmailsList([]);
    setShowDropdown(false);
  }, [type]);

  const toggleDrawer = () => setOpenDrawer((prev) => !prev);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await httpClient.post('/logout');
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
      {/* ── Header ── */}
      <header className="fixed top-0 left-0 z-30 flex h-16 w-full bg-[#f6f8fc] border-b border-[#dadce0]/60">
        {/* Hamburger menu — aligns with icon rail below */}
        <div className="w-16 md:w-20 shrink-0 flex items-center justify-center">
          <IconButton
            size="small"
            onClick={toggleDrawer}
            aria-label="Toggle navigation"
            className="text-gsubtext hover:bg-gray-200/60"
          >
            <MenuIcon />
          </IconButton>
        </div>

        {/* Logo + Search + Actions */}
        <div className="flex-1 flex items-center py-2 px-3 md:px-4 gap-2 md:gap-4">
          {/* Logo — aligns with nav sidebar */}
          <div className="w-16 sm:w-44 md:w-48 shrink-0 flex items-center gap-2">
            <img src={Logo} alt='Email Logo' className="h-6 w-6 sm:h-7 sm:w-7" />
            <span className="text-[20px] md:text-[22px] text-gsubtext font-normal tracking-tight hidden sm:inline">Email</span>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-2xl min-w-0">
            <div className="flex w-full items-center rounded-full bg-[#eaf1fb] px-3 md:px-4 py-1 md:py-1.5 transition-all focus-within:bg-white focus-within:shadow-sm border border-transparent focus-within:border-[#dadce0]">
              <Search className="text-gsubtext mr-1.5 md:mr-2" fontSize="small" />
              <input
                type="text"
                placeholder="Search mail"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    triggerSearch(searchQuery);
                  }
                }}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) setShowDropdown(true);
                }}
                className="w-full border-0 bg-transparent py-1 text-xs md:text-sm text-gtext outline-none placeholder-gsubtext"
              />
              {searchQuery && (
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchEmailsList([]);
                    setShowDropdown(false);
                    navigate('/emails/inbox');
                  }}
                  sx={{ p: '4px' }}
                >
                  <Close fontSize="small" style={{ fontSize: '18px' }} />
                </IconButton>
              )}
            </div>

            {/* Structured Gmail-Style Suggestions Dropdown */}
            {showDropdown && (searchQuery.trim().length > 0) && (
              <div 
                className="absolute left-0 right-0 mt-1.5 bg-white border border-[#dadce0] rounded-xl shadow-lg z-50 overflow-hidden flex flex-col"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
              >
                {/* Section 1: Filters */}
                <div className="py-1">
                  <div
                    onClick={() => {
                      triggerSearch(searchQuery);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gtext flex items-center gap-3 font-medium"
                  >
                    <Search className="text-brand-blue text-lg" />
                    <span>Search all mail containing <strong className="text-brand-blue">"{searchQuery}"</strong></span>
                  </div>
                  
                  {!searchQuery.includes(':') && (
                    <>
                      <div
                        onClick={() => {
                          const val = `from:${searchQuery}`;
                          setSearchQuery(val);
                          triggerSearch(val);
                        }}
                        className="px-4 py-1.5 hover:bg-gray-100 cursor-pointer text-xs text-gsubtext flex items-center gap-3 pl-10"
                      >
                        <span>Search emails <strong>from</strong> "{searchQuery}"</span>
                      </div>
                      <div
                        onClick={() => {
                          const val = `to:${searchQuery}`;
                          setSearchQuery(val);
                          triggerSearch(val);
                        }}
                        className="px-4 py-1.5 hover:bg-gray-100 cursor-pointer text-xs text-gsubtext flex items-center gap-3 pl-10"
                      >
                        <span>Search emails sent <strong>to</strong> "{searchQuery}"</span>
                      </div>
                      <div
                        onClick={() => {
                          const val = `subject:${searchQuery}`;
                          setSearchQuery(val);
                          triggerSearch(val);
                        }}
                        className="px-4 py-1.5 hover:bg-gray-100 cursor-pointer text-xs text-gsubtext flex items-center gap-3 pl-10"
                      >
                        <span>Search by <strong>subject</strong> "{searchQuery}"</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Section 2: Direct Matches (Emails) */}
                {searchEmailsList.length > 0 && (
                  <div className="border-t border-[#dadce0]/60 max-h-60 overflow-y-auto">
                    <div className="px-4 py-1.5 bg-[#f6f8fc] text-[10px] font-bold text-gsubtext uppercase tracking-wider">
                      Matching Messages
                    </div>
                    {searchEmailsList.map((email) => (
                      <div
                        key={email._id}
                        onClick={async () => {
                          // Mark as read immediately on click
                          const isEmailRead = email.senderEmail === user?.email ? email.SRead : email.RRead;
                          if (!isEmailRead) {
                            try {
                              await httpClient.put('/read', { id: email._id, value: true, userEmail: user?.email });
                              if (fetchUnreadCount) fetchUnreadCount();
                            } catch (e) {
                              console.error('Error marking search result email as read:', e);
                            }
                          }
                          setShowDropdown(false);
                          const isSender = email.senderEmail === user?.email;
                          const updatedEmail = {
                            ...email,
                            SRead: isSender ? true : email.SRead,
                            RRead: !isSender ? true : email.RRead
                          };
                          navigate(`/emails/${email.type || 'inbox'}/view`, { 
                            state: { email: updatedEmail, type: email.type || 'inbox' } 
                          });
                        }}
                        className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-[#dadce0]/30 last:border-b-0 flex items-center justify-between gap-4 text-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <MailOutlined fontSize="small" className="text-gsubtext shrink-0" />
                          <div className="min-w-0 flex-1">
                            <span className="font-semibold text-gtext block text-xs truncate">
                              {email.senderName || email.name || 'Unknown'}
                            </span>
                            <span className="text-gsubtext text-xs truncate block">
                              {email.subject || '(No Subject)'} — <span className="text-gray-400">{email.body ? email.body.substring(0, 50) : ''}</span>
                            </span>
                          </div>
                        </div>
                        {email.date && (
                          <div className="text-[11px] text-gsubtext shrink-0">
                            {new Date(email.date).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-0.5 md:gap-1 ml-auto shrink-0">
            <IconButton size="small" aria-label="App launcher" className="text-gsubtext hover:bg-gray-200/60 hidden md:inline-flex">
              <AppsOutlined />
            </IconButton>
            <IconButton size="small" aria-label="Help" className="text-gsubtext hover:bg-gray-200/60 hidden sm:inline-flex">
              <HelpOutline />
            </IconButton>
            <IconButton size="small" aria-label="Settings" className="text-gsubtext hover:bg-gray-200/60 hidden sm:inline-flex">
              <SettingsOutlined />
            </IconButton>
            <IconButton size="small" aria-label="Notifications" className="text-gsubtext hover:bg-gray-200/60">
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsOutlined />
              </Badge>
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
      <ComposeMail 
        openDialog={openDialog} 
        setOpenDialog={setOpenDialog} 
        composeParams={composeParams} 
        setComposeParams={setComposeParams} 
      />

      {/* ── Body (below header) ── */}
      <div className="flex relative" style={{ marginTop: 64, height: 'calc(100vh - 64px)' }}>

        {/* Icon Rail */}
        <aside className="hidden md:flex w-16 md:w-20 shrink-0 flex-col items-center pt-3 bg-[#f6f8fc] border-r border-[#dadce0]/30 overflow-y-auto">
          <Box sx={iconRailItemSx(true)}>
            <MailOutlined sx={{ fontSize: 22 }} />
            <Typography sx={{ fontSize: '11px', fontWeight: 600, lineHeight: 1.2 }}>Mail</Typography>
          </Box>
          <Box sx={iconRailItemSx(false)}>
            <ChatBubbleOutline sx={{ fontSize: 22 }} />
            <Typography sx={{ fontSize: '11px', fontWeight: 500, lineHeight: 1.2 }}>Chat</Typography>
          </Box>
          <Box sx={iconRailItemSx(false)}>
            <VideocamOutlined sx={{ fontSize: 22 }} />
            <Typography sx={{ fontSize: '11px', fontWeight: 500, lineHeight: 1.2 }}>Meet</Typography>
          </Box>
        </aside>

        {/* Mobile backdrop */}
        {openDrawer && (
          <div
            onClick={() => setOpenDrawer(false)}
            className="fixed inset-0 top-16 bg-black/20 z-30 md:hidden"
          />
        )}

        {/* Nav Sidebar */}
        <nav
          className={`
            shrink-0 flex flex-col bg-[#f6f8fc] py-3 overflow-y-auto transition-all duration-300
            fixed md:relative top-16 md:top-0 left-0 h-[calc(100vh-64px)] md:h-auto z-40 md:z-10
            border-r border-[#dadce0]/20 w-64 max-w-[80vw]
            ${openDrawer ? 'translate-x-0 opacity-100' : '-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden'}
          `}
        >
          <Button
            onClick={() => setOpenDialog(true)}
            sx={composeButtonSx}
          >
            <AddIcon sx={{ mr: 1.5 }} />
            <span>Compose</span>
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
                  sx={sidebarItemSx}
                  onClick={() => {
                    // Close drawer on navigation on mobile devices
                    if (window.innerWidth < 768) {
                      setOpenDrawer(false);
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 2,
                      color: selected ? '#041e49' : '#444746',
                    }}
                  >
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={item.title} sx={{ '& .MuiTypography-root': { fontWeight: selected ? 600 : 500 } }} />
                  {item.name === 'inbox' && unreadCount > 0 && (
                    <Typography
                      sx={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: selected ? '#041e49' : '#1a73e8',
                        ml: 'auto',
                        backgroundColor: selected ? '#c2e7ff' : '#eaf1fb',
                        px: 1,
                        py: 0.25,
                        borderRadius: '10px',
                      }}
                    >
                      {unreadCount}
                    </Typography>
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </nav>

        {/* Main Content — remaining space */}
        <main className="flex-1 overflow-hidden flex flex-col bg-[#f6f8fc] min-w-0">
          <Suspense fallback={<Loader />}>
            <Outlet context={{ openDrawer, selectedEmails, setSelectedEmails, setOpenDialog, composeParams, setComposeParams, unreadCount, fetchUnreadCount }} />
          </Suspense>
          {/* Disclaimer notice */}
          <footer className="bg-yellow-50 border-t border-yellow-200 px-4 py-2 text-center text-[11px] text-yellow-800 flex-shrink-0 relative z-10">
            <strong>Notice:</strong> This is a portfolio / test project and is not a real email service. Do not send sensitive personal information.
          </footer>
        </main>
      </div>

      {/* ── Account Dropdown Menu ── */}
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
            {user?.name || 'User'} {userRole && `(${userRole.toUpperCase()})`}
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
