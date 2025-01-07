import { createFileRoute } from '@tanstack/react-router';
import { philosophersApi } from '../../api';
import { Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';

function PhilosophersSkeleton() {
  return (
    <Grid container spacing={2} padding={2}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Grid item xs={12} md={6} lg={4} key={i}>
          <Card>
            <CardContent>
              <Skeleton variant="text" height={40} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="rectangular" height={100} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export const Route = createFileRoute('/philosophers/')({
  loader: () => philosophersApi.getAll(),
  pendingComponent: () => <PhilosophersSkeleton />,
  component: PhilosophersComponent,
});

function PhilosophersComponent() {
  const philosophers = Route.useLoaderData();
  const navigate = Route.useNavigate();

  return (
    <Grid container spacing={2} padding={2}>
      {philosophers?.map((philosopher) => (
        <Grid item xs={12} md={6} lg={4} key={philosopher.id}>
          <Card>
            <CardContent onClick={() => navigate({ to: `/philosophers/$id`, params: { id: philosopher.id.toString() } })} sx={{ cursor: 'pointer' }}>
              <Typography variant="h5" gutterBottom>
                {philosopher.name}
              </Typography>
              <Typography color="text.secondary">
                {philosopher.birthYear} - {philosopher.deathYear}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {philosopher.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
