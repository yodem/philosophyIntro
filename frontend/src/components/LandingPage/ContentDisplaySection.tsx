import { Grid, Typography } from '@mui/material';
import ContentDisplayCard from './ContentDisplayCard';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslation } from 'react-i18next';

function ContentDisplaySection() {
  const { t } = useTranslation();

  return (
    <Grid container spacing={4}>
      <Grid xs={12} item sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant='h4'>{t('sections')}</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard to="/philosophers" Icon={<PersonIcon />} title={t('philosophers')} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard to="/questions" Icon={<PersonIcon />} title={t('questions')} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard to="/terms" Icon={<PersonIcon />} title={t('terms')} />
      </Grid>
    </Grid>
  )
}

export default ContentDisplaySection
