import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function AboutDisplay() {
    const { t } = useTranslation();

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                {t('about')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                {t('aboutDescription')}
            </Typography>
        </Box>
    )
}

export default AboutDisplay
