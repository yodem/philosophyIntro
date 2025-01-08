import { createFileRoute } from '@tanstack/react-router';
import { questionsApi } from '../../api';
import { Card, CardContent, Grid, Skeleton, Typography, Button } from '@mui/material';

function QuestionsSkeleton() {
    return (
        <Grid container spacing={2} padding={2}>
            {[1, 2, 3, 4].map((i) => (
                <Grid item xs={12} key={i}>
                    <Card>
                        <CardContent>
                            <Skeleton variant="text" height={40} />
                            <Skeleton variant="rectangular" height={80} />
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export const Route = createFileRoute('/questions/')({
    loader: () => questionsApi.getAll(),
    pendingComponent: () => <QuestionsSkeleton />,
    component: QuestionsComponent,
});

function QuestionsComponent() {
    const questions = Route.useLoaderData();
    const navigate = Route.useNavigate();

    return (
        <>
            <Button variant="outlined" onClick={() => navigate({ to: '/questions/new' })}>
                Add New Question
            </Button>
            <Grid container spacing={2} padding={2}>
                {questions?.map((question) => (
                    <Grid item xs={12} key={question.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    {question.question}
                                </Typography>
                                <Typography variant="body1">
                                    {question.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
