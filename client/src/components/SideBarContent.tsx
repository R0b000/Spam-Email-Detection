import { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, styled, Button, Typography } from '@mui/material';
import { SIDEBAR_DATA } from '../config/sidebar.config';
import { useParams, NavLink } from 'react-router-dom';
import { routes } from '../Router/routes';
import ComposeMail from './ComposeMail';
import axios from 'axios';
import { API_URI } from '../Configuration/axios';
import { useAuth } from '../context/AuthContext';
import { Add as AddIcon } from '@mui/icons-material';
import type { Mail } from '../types';

const ComposeButton = styled(Button)({
  background: '#c2e7ff',
  color: '#001d35',
  padding: '16px',
  borderRadius: '16px',
  minWidth: '140px',
  width: '140px',
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: '500',
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  display: 'flex',
  justifyContent: 'center',
  gap: '12px',
  '&:hover': {
    background: '#b6dcfb',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  },
});

const NavList = styled(List)({
  padding: '8px 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

const NavItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  minHeight: '32px',
  borderRadius: '0 16px 16px 0',
  padding: '0 12px 0 0',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  color: '#202124',
  textDecoration: 'none',
  '&.active': {
    backgroundColor: '#d3e3fd',
    fontWeight: 700,
  },
  '&:hover': {
    backgroundColor: 'rgba(60,64,67,0.08)',
  },
  '&:hover .nav-title': {
    fontWeight: 700,
  },
});

const NavIcon = styled(ListItemIcon)({
  minWidth: '48px',
  paddingLeft: '12px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#001d35',
  '& .MuiSvgIcon-root': {
    fontSize: '20px',
  },
});

const NavText = styled(Typography)({
  flex: 1,
  fontSize: '14px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: '#202124',
});

const NavCount = styled(Typography)({
  fontSize: '12px',
  color: '#5f6368',
  fontWeight: 500,
  marginLeft: 'auto',
  paddingRight: '8px',
});

const Container = styled(Box)({
  padding: '8px 0 0 0',
  overflowY: 'auto',
  height: '100%',
});

const SideBarContent: React.FC = () => {
  const { type = '' } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const { user } = useAuth();

  // Fetch the email count for every folder so the sidebar can show unread-style counts.
  useEffect(() => {
    const userEmail = user?.email;
    if (!userEmail) return;

    const fetchCounts = async () => {
      const results = await Promise.all(
        SIDEBAR_DATA.map(async (item) => {
          try {
            const res = await axios.get(`${API_URI}/emails/${item.name}?userEmail=${userEmail}`);
            return { name: item.name, count: (res.data as Mail[]).length };
          } catch {
            return { name: item.name, count: 0 };
          }
        })
      );
      const next = results.reduce((acc, r) => {
        acc[r.name] = r.count;
        return acc;
      }, {} as Record<string, number>);
      setCounts(next);
    };

    fetchCounts();
  }, [user?.email]);

  const onComposeClick = () => {
    setOpenDialog(true);
  };

  const renderNavLinks = () => {
    return SIDEBAR_DATA.map((data) => {
      const isActive = type.toLowerCase() === data.name;
      const count = counts[data.name] ?? 0;
      return (
        <NavLink
          key={data.name}
          to={`${routes.emails.path}/${data.name}`}
          style={{ textDecoration: 'none' }}
        >
          <NavItem className={isActive ? 'active' : ''}>
            <NavIcon>
              <data.icon />
            </NavIcon>
            <NavText className="nav-title">{data.title}</NavText>
            {count > 0 && <NavCount>{count}</NavCount>}
          </NavItem>
        </NavLink>
      );
    });
  };

  return (
    <Container>
      <Box style={{ padding: '4px 8px 12px 8px' }}>
        <ComposeButton onClick={onComposeClick}>
          <AddIcon style={{ fontSize: 28 }} />
          Compose
        </ComposeButton>
      </Box>
      <NavList>{renderNavLinks()}</NavList>
      <ComposeMail openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </Container>
  );
};

export default SideBarContent;