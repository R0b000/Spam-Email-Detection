import { useState } from 'react';
import { AppBar, Toolbar, styled, InputBase, Box, Button, Avatar } from '@mui/material';
import { Menu as MenuIcon, Search, Tune, SettingsOutlined } from '@mui/icons-material';
import Logo from '../img/logo.png';
import Profile from './Profile';

const StyledAppBar = styled(AppBar)({
  background: '#F5F5F5',
  boxShadow: 'none',
  display:'flex',
  position:'fixed', // Set position to fixed
  width: '100%', // Ensure the app bar spans the entire width of the viewport
  zIndex: 1000, // Ensure it appears above other elements
});

const SearchWrapper = styled(Box)({
  background: '#EAF1FB',
  borderRadius: 8,
  width: '50%', // 1/2 width for the search section
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 20px',
  '& > div': {
    width: '100%',
    padding: '0 10px'
  }
});

const OptionScrapper = styled(Box)({
  width: '50%', // 1/2 width for the options section
  display: 'flex',
  justifyContent: 'end',
  '& > svg': {
    marginLeft: 15
  }
});

const Header = ({ toggleDrawer }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const onUserClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box>
      <StyledAppBar>
        <Toolbar>
          {/* First Section: Menu Icon and Logo */}
          <Box style={{ display: 'flex', alignItems: 'center', width: '25%' }}>
            <MenuIcon color="action" onClick={toggleDrawer} />
            <img src={Logo} alt="logo" style={{ width: 35, height: 35, margin: 15 ,display:'flex', position:'relative'}} />
            <p style={{ color: 'black', fontSize: '20px', display: 'flex', textAlign: 'center', justifyContent: 'center', marginTop: '10px' }}>Email</p>
          </Box>

          {/* Second Section: Search */}
          <SearchWrapper>
            <Search color="action" />
            <InputBase placeholder='Search Mail' />
            <Tune color="action" />
          </SearchWrapper>

          {/* Fourth Section: Options */}
          <OptionScrapper>
            <Button>
              <SettingsOutlined color="action" />
            </Button>
            <Button onClick={onUserClick}>
              <Avatar color="action" />
            </Button>
          </OptionScrapper>
        </Toolbar>
      </StyledAppBar>
      <Profile open={openDialog} onClose={handleCloseDialog}/>
    </Box>
  );
};

export default Header;
