import { CircularProgress, Typography } from '@mui/material';

const SuspenseLoader: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <CircularProgress />
        <Typography variant="body1" className="mt-2">
          Loading...
        </Typography>
      </div>
    </div>
  );
};

export default SuspenseLoader;