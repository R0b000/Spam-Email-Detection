import { Box, IconButton, Tooltip, styled } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { SIDEBAR_DATA } from '../config/sidebar.config';
import { routes } from '../routes/routes';
import Logo from '../img/logo.png';

const MiniBar = styled(Box)({
  position: 'fixed',
  top: 64,
  left: 0,
  width: 64,
  height: 'calc(100vh - 64px)',
  background: '#ffffff',
  borderRight: '1px solid #dadce0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: 8,
  boxSizing: 'border-box',
  zIndex: 1100,
});

const BrandLogo = styled('img')({
  width: 32,
  height: 32,
  objectFit: 'contain',
  marginBottom: 12,
});

const NavIconButton = styled(IconButton)({
  width: 48,
  height: 40,
  minHeight: 40,
  borderRadius: '0 16px 16px 0',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#5f6368',
  '&:hover': {
    backgroundColor: 'rgba(60,64,67,0.08)',
  },
  '&.active': {
    backgroundColor: '#d3e3fd',
    '& .MuiSvgIcon-root': {
      color: '#1a73e8',
    },
  },
});

const MiniSideBar: React.FC = () => {
  return (
    <MiniBar>
      <BrandLogo src={Logo} alt="Email" />
      {SIDEBAR_DATA.map((data) => (
        <NavLink key={data.name} to={`${routes.emails.path}/${data.name}`}>
          {({ isActive }) => (
            <Tooltip title={data.title} placement="right" arrow>
              <NavIconButton className={isActive ? 'active' : ''}>
                <data.icon style={{ fontSize: 22 }} />
              </NavIconButton>
            </Tooltip>
          )}
        </NavLink>
      ))}
    </MiniBar>
  );
};

export default MiniSideBar;