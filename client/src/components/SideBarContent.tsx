import { useState, useEffect } from 'react';
import { Box, List, ListItemIcon, Button, Typography } from '@mui/material';
import { SIDEBAR_DATA } from '../config/sidebar.config';
import { useParams, NavLink } from 'react-router-dom';
import { routes } from '../Router/routes';
import ComposeMail from './ComposeMail';
import axios from 'axios';
import { API_URI } from '../Configuration/axios';
import { useAuth } from '../context/AuthContext';
import { Add as AddIcon } from '@mui/icons-material';
import type { Mail } from '../types';

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
          <Box
            className={`nav-item group flex items-center min-h-[32px] rounded-r-[16px] pl-0 pr-3 cursor-pointer text-sm font-medium text-gtext text-decoration-none ${
              isActive ? 'bg-chips-blue font-bold' : 'hover:bg-[#3c40430d]'
            }`}
          >
            <ListItemIcon className="min-w-[48px] pl-[12px] flex items-center justify-center" sx={{ '& .MuiSvgIcon-root': { fontSize: '20px' } }}>
              <data.icon sx={{ color: '#001d35' }} />
            </ListItemIcon>
            <Typography
              className="nav-title flex-1 text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis text-gtext group-hover:font-bold"
            >
              {data.title}
            </Typography>
            {count > 0 && (
              <Typography className="text-xs text-gsubtext font-medium ml-auto pr-[8px]">
                {count}
              </Typography>
            )}
          </Box>
        </NavLink>
      );
    });
  };

  return (
    <Box className="overflow-y-auto h-full">
      <Box className="p-[4px_8px_12px_8px]">
        <Button
          onClick={onComposeClick}
          className="bg-compose-blue text-[#001d35] font-medium rounded-xl text-sm normal-case w-[140px] h-auto py-4 px-4 flex items-center justify-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:bg-[#b6dcfb] hover:shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
        >
          <AddIcon sx={{ fontSize: 28 }} />
          Compose
        </Button>
      </Box>
      <List className="p-0 m-0 flex flex-col gap-0.5">{renderNavLinks()}</List>
      <ComposeMail openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </Box>
  );
};

export default SideBarContent;