import { Grid, Typography } from '@mui/material';
import ContentDisplayCard from './ContentDisplayCard';
import PersonIcon from '@mui/icons-material/Person';
function ContentDisplaySection() {
  return (
    <Grid container spacing={4}>
      <Grid xs={12} item sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant='h4'>Sections</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard to="/philosophers" Icon={<PersonIcon />} title="Philosophers" />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard to="/questions" Icon={<PersonIcon />} title="Questions" />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ContentDisplayCard to="/terms" Icon={<PersonIcon />} title="Terms" />
      </Grid>
    </Grid>
  )
}

export default ContentDisplaySection
