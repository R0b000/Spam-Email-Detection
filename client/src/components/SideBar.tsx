import { Drawer, styled } from '@mui/material';
import SideBarContent from './SideBarContent';

const StyledDrawer = styled(Drawer)`
  margin-top: 64px;
`;

interface SideBarProps {
  toggleDrawer?: () => void;
  openDrawer: boolean;
}

const SideBar = ({ toggleDrawer, openDrawer }: SideBarProps) => {
  return (
    <StyledDrawer
      anchor="left"
      open={openDrawer}
      onClose={toggleDrawer}
      hideBackdrop={true}
      ModalProps={{
        keepMounted: true,
      }}
      variant="persistent"
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
    </StyledDrawer>
  );
};

export default SideBar;