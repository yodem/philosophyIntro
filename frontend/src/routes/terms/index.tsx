import { createFileRoute } from '@tanstack/react-router';
import { termsApi } from '../../api';
import { Card, CardContent, Grid, Skeleton, Typography, Button } from '@mui/material';

function TermsSkeleton() {
    return (
        <Grid container spacing={2} padding={2}>
            {[1, 2, 3, 4].map((i) => (
                <Grid item xs={12} md={6} key={i}>
                    <Card>
                        <CardContent>
                            <Skeleton variant="text" height={32} />
                            <Skeleton variant="rectangular" height={60} />
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
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
            <Grid container spacing={2} padding={2}>
                {terms?.map((term) => (
                    <Grid item xs={12} md={6} key={term.id}>
                        <Card>
                            <CardContent
                                onClick={() => navigate({ to: '/terms/$id', params: { id: term.id.toString() } })}
                                sx={{ cursor: 'pointer' }}
                            >
                                <Typography variant="h5" gutterBottom>
                                    {term.term}
                                </Typography>
                                <div dangerouslySetInnerHTML={{ __html: term.definition }} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
