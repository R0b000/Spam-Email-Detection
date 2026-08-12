
import {Box, CircularProgress, Typography } from "@mui/material";

const SuspenseLoader = () => {
    return(
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
        >
            <Box textAlign="center">
                <CircularProgress />
                <Typography variant="body1" mt={2}>
                    Loading...
                </Typography>
            </Box>
        </Box>
    )
}

export default SuspenseLoader;