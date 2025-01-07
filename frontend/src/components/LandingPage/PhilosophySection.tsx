import ContentDisplayCard from '@/components/LandingPage/ContentDisplayCard';
import { Grid, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

function PhilosophySection() {
  return (
    <Grid container spacing={4}>
      <Grid xs={12} item sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant='h4'>What Is Philosophy?</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard Icon={<PersonIcon />} title="Deal With Imposible Questions" />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard Icon={<PersonIcon />} title="Loving Wisdom" />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard Icon={<PersonIcon />} title="Turn Mythos To Logos" />
      </Grid>
    </Grid>
  )
}

export default PhilosophySection
