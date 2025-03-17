import { createFileRoute } from '@tanstack/react-router';
import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import { philosophersApi } from '../../api';
import { LABELS } from '@/constants';
import { EntityDetailView } from '@/components/EntityDetailView';
import { useEntityUpdate } from '@/hooks/useEntityUpdate';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

function PhilosopherSkeleton() {
  return (
    <Box p={2}>
      <Card>
        <CardContent>
          <Skeleton variant="text" height={60} width="40%" />
          {/* ...other skeleton elements... */}
        </CardContent>
      </Card>
    </Box>
  );
}

// Define the philosopher query options
export const philosopherQueryOptions = (philosopherId: string) =>
  queryOptions({
    queryKey: ['philosopher', philosopherId],
    queryFn: () => philosophersApi.getOne(philosopherId)
  });

export const Route = createFileRoute('/philosophers/$id')({
  loader: ({ params }) => philosopherQueryOptions(params.id),
  pendingComponent: PhilosopherSkeleton,
  component: PhilosopherComponent,
});

function PhilosopherComponent() {
  // Get the query options from the loader
  const queryOptions = Route.useLoaderData();
  // Use the query options to fetch the data
  const { data: philosopher } = useSuspenseQuery(queryOptions);
  const updatePhilosopher = useEntityUpdate('philosopher', philosophersApi.update);

  return philosopher ? (
    <EntityDetailView
      entity={philosopher}
      entityType="פילוסוף"
      entityRoute="philosophers"
      updateMutation={updatePhilosopher}
      queryKey={['philosopher', philosopher.id]}
    />
  ) : (
    <Typography variant="h6">{LABELS.PHILOSOPHER_NOT_FOUND}</Typography>
  );
}
