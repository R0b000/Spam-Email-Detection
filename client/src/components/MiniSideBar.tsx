import { Box, IconButton, Tooltip } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { SIDEBAR_DATA } from '../config/sidebar.config';
import { routes } from '../Router/routes';
import Logo from '../img/Email.svg';

const MiniSideBar: React.FC = () => {
  return (
    <Box className="fixed top-[64px] left-0 w-16 h-[calc(100vh-64px)] bg-white border-r border-[#dadce0] flex flex-col items-center pt-2 box-border z-[1100]">
      <img src={Logo} alt="Email" className="w-8 h-8 object-contain mb-3" />
      {SIDEBAR_DATA.map((data) => (
        <NavLink key={data.name} to={`${routes.emails.path}/${data.name}`}>
          {({ isActive }) => (
            <Tooltip title={data.title} placement="right" arrow>
              <IconButton
                className={`w-12 h-10 min-h-10 rounded-r-[16px] p-0 flex items-center justify-center text-[#5f6368] transition-colors ${
                  isActive
                    ? 'bg-chips-blue [&_.MuiSvgIcon-root]:text-brand-blue'
                    : 'hover:bg-[#3c40430d]'
                }`}
              >
                <data.icon style={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>
          )}
        </NavLink>
      ))}
    </Box>
  );
};

export default MiniSideBar;