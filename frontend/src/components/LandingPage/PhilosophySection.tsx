import ContentDisplayCard from '@/components/LandingPage/ContentDisplayCard';
import { Grid, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslation } from 'react-i18next';

function PhilosophySection() {
  const { t } = useTranslation();

  return (
    <Grid container spacing={4}>
      <Grid xs={12} item sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant='h4'>{t('whatIsPhilosophy')}</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard Icon={<PersonIcon />} title={t('impossibleQuestions')} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard Icon={<PersonIcon />} title={t('lovingWisdom')} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard Icon={<PersonIcon />} title={t('mythosToLogos')} />
      </Grid>
    </Grid>
  )
}

export default PhilosophySection
