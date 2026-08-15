import React from 'react';
import { Box, Fab } from '@mui/material';
import { Add } from '@mui/icons-material';
import ComposeMail from '../../components/ComposeMail';

interface EmailPageLayoutProps {
  children: React.ReactNode;
}

const EmailPageLayout: React.FC<EmailPageLayoutProps> = ({ children }) => {
  const [openDialog, setOpenDialog] = React.useState(false);

  return (
    <Box className="relative h-full">
      {children}
      <Fab
        color="primary"
        aria-label="compose"
        className="absolute bottom-6 right-6"
        onClick={() => setOpenDialog(true)}
      >
        <Add />
      </Fab>
      <ComposeMail openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </Box>
  );
};

export default EmailPageLayout;
