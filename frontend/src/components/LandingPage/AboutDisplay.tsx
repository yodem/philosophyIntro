import { Box, Typography } from '@mui/material'

function AboutDisplay() {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                About
            </Typography>
            <Typography variant="body1" color="text.secondary">
                This is a platform to explore philosophical concepts, questions, and notable philosophers.
            </Typography>
        </Box>
    )
}

export default AboutDisplay
