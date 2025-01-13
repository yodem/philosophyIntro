import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function Description() {
    const { t } = useTranslation();

    return (
        <Box sx={{ my: 4, display: "flex", justifyContent: "center" }}>
            <Typography variant='h2'>{t('welcomeToPhilosophy')}</Typography>
        </Box>
    );
}

export default Description;
