import { createFileRoute } from '@tanstack/react-router';
import { termsApi } from '@/api';
import { Button } from '@mui/material';
import ResourceCard from '@/components/ResourceCard'; // Import the generic component
import ResourceGrid from '@/components/ResourceGrid'; // Import the generic grid component
import ResourceSkeleton from '@/components/ResourceSkeleton';

function TermsSkeleton() {
    return (
        <ResourceGrid>
            {[1, 2, 3, 4].map((i) => (
                <ResourceSkeleton key={i} />
            ))}
        </ResourceGrid>
    );
}

export const Route = createFileRoute('/terms/')({
    loader: () => termsApi.getAll(),
    pendingComponent: () => <TermsSkeleton />,
    component: TermsComponent,
});

function TermsComponent() {
    const terms = Route.useLoaderData();
    const navigate = Route.useNavigate();

    return (
        <>
            <Button variant="outlined" onClick={() => navigate({ to: '/terms/new' })}>
                Add New Term
            </Button>
            <ResourceGrid>
                {terms?.map((term) => (
                    <ResourceCard
                        key={term.id}
                        title={term.term}
                        onClick={() => navigate({ to: '/terms/$id', params: { id: term.id.toString() } })}
                    />
                ))}
            </ResourceGrid>
        </>
    );
}
