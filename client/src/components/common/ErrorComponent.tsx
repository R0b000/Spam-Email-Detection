import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

const ErrorComponent: React.FC = () => {
  const location = useLocation();

  return (
    <div className="ml-[250px]">
      <Typography>There was an error loading this page</Typography>
      <Typography>Error Location: {location.pathname}</Typography>
    </div>
  );
};

export default ErrorComponent;