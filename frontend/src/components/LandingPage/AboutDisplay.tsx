import { Box, Typography } from '@mui/material';
import { TEXTS } from '@/constants';

function AboutDisplay() {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                {TEXTS.ABOUT}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                {TEXTS.ABOUT_DESCRIPTION}
            </Typography>
        </Box>
    )
}

export default AboutDisplay
