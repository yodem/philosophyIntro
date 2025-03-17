import { createFileRoute } from '@tanstack/react-router';
import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import { termsApi } from '../../api';
import { LABELS } from '@/constants';
import { EntityDetailView } from '@/components/EntityDetailView';
import { useEntityUpdate } from '@/hooks/useEntityUpdate';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

function TermSkeleton() {
    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <Skeleton variant="text" height={40} />
                    <Skeleton variant="rectangular" height={80} sx={{ mt: 2 }} />
                    {/* ...other skeleton elements... */}
                </CardContent>
            </Card>
        </Box>
    );
}

// Define the term query options
export const termQueryOptions = (termId: string) =>
    queryOptions({
        queryKey: ['term', termId],
        queryFn: () => termsApi.getOne(termId)
    });

export const Route = createFileRoute('/terms/$id')({
    loader: ({ params }) => termQueryOptions(params.id),
    pendingComponent: TermSkeleton,
    component: TermComponent,
});

function TermComponent() {
    // Get the query options from the loader
    const queryOptions = Route.useLoaderData();
    // Use the query options to fetch the data
    const { data: term } = useSuspenseQuery(queryOptions);
    const updateTerm = useEntityUpdate('term', termsApi.update);

    return term ? (
        <EntityDetailView
            entity={term}
            entityType="מושג"
            entityRoute="terms"
            updateMutation={updateTerm}
            queryKey={['term', term.id]}
        />
    ) : (
        <Typography variant="h6">{LABELS.TERM_NOT_FOUND}</Typography>
    );
}
