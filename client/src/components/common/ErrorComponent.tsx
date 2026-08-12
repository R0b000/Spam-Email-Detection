import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

const ErrorComponent: React.FC = () => {
  const location = useLocation();

  return (
    <Box sx={{ marginLeft: 250 }}>
      <Typography>There was an error loading this page</Typography>
      <Typography>Error Location: {location.pathname}</Typography>
    </Box>
  );
};

export default ErrorComponent;