import React from 'react';
import { CircularProgress, Box } from '@mui/material';

interface LoaderProps {
  size?: number;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 40, className = '' }) => {
  return (
    <Box className={`flex items-center justify-center ${className}`}>
      <CircularProgress size={size} />
    </Box>
  );
};

export default Loader;
