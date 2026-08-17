import React from 'react';
import { Box } from '@mui/material';

interface EmailPageLayoutProps {
  children: React.ReactNode;
}

const EmailPageLayout: React.FC<EmailPageLayoutProps> = ({ children }) => {
  return <Box className="relative h-full">{children}</Box>;
};

export default EmailPageLayout;
