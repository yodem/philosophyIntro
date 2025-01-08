import { createFileRoute } from '@tanstack/react-router';
import { philosophersApi } from '@/api';
import { Button } from '@mui/material';
import ResourceCard from '@/components/ResourceCard'; // Import the generic component
import ResourceGrid from '@/components/ResourceGrid'; // Import the generic grid component
import ResourceSkeleton from '@/components/ResourceSkeleton'; // Import the generic skeleton component

function PhilosophersSkeleton() {
  return (
    <ResourceGrid>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <ResourceSkeleton key={i} />
      ))}
    </ResourceGrid>
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
    <>
      <Button variant="outlined" onClick={() => navigate({ to: '/philosophers/new' })}>
        Add New Philosopher
      </Button>
      <ResourceGrid>
        {philosophers?.map((philosopher) => (
          <ResourceCard
            key={philosopher.id}
            title={philosopher.name}
            onClick={() => navigate({ to: `/philosophers/$id`, params: { id: philosopher.id.toString() } })}
          />
        ))}
      </ResourceGrid>
    </>
  );
}
