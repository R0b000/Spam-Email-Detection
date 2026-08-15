import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import SendIcon from '@mui/icons-material/Send';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import ReportIcon from '@mui/icons-material/Report';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  onClick?: () => void;
}

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
  items: MenuItem[];
  selectedPath?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, items, selectedPath }) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: 256,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 256,
          boxSizing: 'border-box',
          borderRight: '1px solid #dadce0',
          background: '#ffffff',
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
        },
      }}
    >
      <Toolbar />
      <List>
        {items.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={item.onClick}
            selected={item.path === selectedPath}
            className="rounded-lg mx-2 mb-1"
            sx={{
              '&.Mui-selected': {
                background: '#e8f0fe',
                '&:hover': { background: '#d3e3fd' },
              },
            }}
          >
            <ListItemIcon className="text-gsubtext">{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} className="text-gtext" />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
