import { createFileRoute } from '@tanstack/react-router';
import { termsApi } from '../../api';
import { Card, CardContent, Box, Skeleton, Typography, Chip, Divider, List, ListItem, ListItemText } from '@mui/material';

function TermSkeleton() {
    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <Skeleton variant="text" height={40} />
                    <Skeleton variant="rectangular" height={80} sx={{ mt: 2 }} />
                    <Skeleton variant="text" height={24} width="60%" sx={{ mt: 2 }} />
                    <Skeleton variant="rectangular" height={60} sx={{ mt: 2 }} />
                </CardContent>
            </Card>
        </Box>
    );
}

export const Route = createFileRoute('/terms/$id')({
    loader: ({ params }) => termsApi.getOne(Number(params.id)),
    pendingComponent: TermSkeleton,
    component: TermComponent,
});

function TermComponent() {
    const term = Route.useLoaderData();

    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {term.term}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {term.definition}
                    </Typography>

                    {term.philosophers && term.philosophers.length > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>Key Philosophers</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {term.philosophers.map(philosopher => (
                                    <Chip
                                        key={philosopher.id}
                                        label={philosopher.name}
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </>
                    )}

                    {term.questions && term.questions.length > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>Related Questions</Typography>
                            <List>
                                {term.questions.map(question => (
                                    <ListItem key={question.id}>
                                        <ListItemText
                                            primary={question.question}
                                            secondary={question.description}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
