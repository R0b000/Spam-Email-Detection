import React from 'react';
import { Box } from '@mui/material';

interface EmailPageLayoutProps {
  children: React.ReactNode;
}

const EmailPageLayout: React.FC<EmailPageLayoutProps> = ({ children }) => {
  return <Box className="relative flex-1 min-h-0 overflow-hidden">{children}</Box>;
};

export default EmailPageLayout;
