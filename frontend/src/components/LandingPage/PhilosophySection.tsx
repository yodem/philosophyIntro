import ContentDisplayCard from '@/components/LandingPage/ContentDisplayCard';
import { Grid, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { TEXTS } from '@/constants';

function PhilosophySection() {
  return (
    <Grid container spacing={4}>
      <Grid xs={12} item sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant='h4'>{TEXTS.WHAT_IS_PHILOSOPHY}</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard Icon={<PersonIcon />} title={TEXTS.IMPOSSIBLE_QUESTIONS} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard Icon={<PersonIcon />} title={TEXTS.LOVING_WISDOM} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard Icon={<PersonIcon />} title={TEXTS.MYTHOS_TO_LOGOS} />
      </Grid>
    </Grid>
  )
}

export default PhilosophySection
