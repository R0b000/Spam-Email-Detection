import { Drawer } from '@mui/material';
import SideBarContent from './SideBarContent';

interface SideBarProps {
  toggleDrawer?: () => void;
  openDrawer: boolean;
}

const SideBar = ({ toggleDrawer, openDrawer }: SideBarProps) => {
  return (
    <Drawer
      anchor="left"
      open={openDrawer}
      onClose={toggleDrawer}
      hideBackdrop={true}
      ModalProps={{
        keepMounted: true,
      }}
      variant="persistent"
      className="mt-[64px]"
      sx={{
        '& .MuiDrawer-paper': {
          width: 256,
          borderRight: '1px solid #dadce0',
          background: '#ffffff',
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
          overflowX: 'hidden',
        },
      }}
    >
      <SideBarContent />
    </Drawer>
  );
};

export default SideBar;