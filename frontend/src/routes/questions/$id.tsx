import { createFileRoute } from '@tanstack/react-router';
import { questionsApi } from '../../api';
import { Card, CardContent, Box, Skeleton, Typography, Chip, Avatar, Divider } from '@mui/material';

function QuestionSkeleton() {
    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <Skeleton variant="text" height={40} />
                    <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
                    <Skeleton variant="text" height={32} sx={{ mt: 2 }} />
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} variant="circular" width={40} height={40} />
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export const Route = createFileRoute('/questions/$id')({
    loader: ({ params }) => questionsApi.getOne(Number(params.id)),
    pendingComponent: QuestionSkeleton,
    component: QuestionComponent,
});

function QuestionComponent() {
    const question = Route.useLoaderData();

    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {question.question}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {question.description}
                    </Typography>

                    {question.philosophers && question.philosophers.length > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>Discussed by</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {question.philosophers.map(philosopher => (
                                    <Chip
                                        key={philosopher.id}
                                        avatar={<Avatar>{philosopher.name[0]}</Avatar>}
                                        label={philosopher.name}
                                    />
                                ))}
                            </Box>
                        </>
                    )}

                    {question.terms && question.terms.length > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>Related Terms</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {question.terms.map(term => (
                                    <Chip key={term.id} label={term.term} variant="outlined" />
                                ))}
                            </Box>
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
