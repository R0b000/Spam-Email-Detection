import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom'; // Correct import statement

const ErrorComponent = () => {
    const location = useLocation(); // Corrected hook

    return (
        <Box sx={{ marginLeft: 250 }}> {/* Corrected styling prop */}
            <Typography>
                There was an error loading this page
            </Typography>
            {/* You can also display additional error information if needed */}
            <Typography>
                Error Location: {location.pathname}
            </Typography>
        </Box>
    );
};

export default ErrorComponent;
