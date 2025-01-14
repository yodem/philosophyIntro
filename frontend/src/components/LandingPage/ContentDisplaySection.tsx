import { Grid, Typography } from '@mui/material';
import ContentDisplayCard from './ContentDisplayCard';
import PersonIcon from '@mui/icons-material/Person';
import { TEXTS } from '@/constants';

function ContentDisplaySection() {
  return (
    <Grid container spacing={4}>
      <Grid xs={12} item sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant='h4'>{TEXTS.SECTIONS}</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard to="/philosophers" Icon={<PersonIcon />} title={TEXTS.PHILOSOPHERS} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard to="/questions" Icon={<PersonIcon />} title={TEXTS.QUESTIONS} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard to="/terms" Icon={<PersonIcon />} title={TEXTS.TERMS} />
      </Grid>
    </Grid>
  )
}

export default ContentDisplaySection
