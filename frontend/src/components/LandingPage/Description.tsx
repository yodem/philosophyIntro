import { Box, Typography } from '@mui/material';
import { TEXTS } from '@/constants';

function Description() {
    return (
        <Box sx={{ my: 4, display: "flex", justifyContent: "center" }}>
            <Typography variant='h2'>{TEXTS.WELCOME_TO_PHILOSOPHY}</Typography>
        </Box>
    );
}

export default Description;
