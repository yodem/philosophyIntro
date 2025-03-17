import { createFileRoute } from '@tanstack/react-router';
import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import { questionsApi } from '../../api';
import { LABELS } from '@/constants';
import { EntityDetailView } from '@/components/EntityDetailView';
import { useEntityUpdate } from '@/hooks/useEntityUpdate';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

function QuestionSkeleton() {
    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <Skeleton variant="text" height={40} />
                    <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
                    {/* ...other skeleton elements... */}
                </CardContent>
            </Card>
        </Box>
    );
}

// Define the question query options
export const questionQueryOptions = (questionId: string) =>
    queryOptions({
        queryKey: ['question', questionId],
        queryFn: () => questionsApi.getOne(questionId)
    });

export const Route = createFileRoute('/questions/$id')({
    loader: ({ params }) => questionQueryOptions(params.id),
    pendingComponent: QuestionSkeleton,
    component: QuestionComponent,
});

function QuestionComponent() {
    // Get the query options from the loader
    const queryOptions = Route.useLoaderData();
    // Use the query options to fetch the data
    const { data: question } = useSuspenseQuery(queryOptions);
    const updateQuestion = useEntityUpdate('question', questionsApi.update);

    return question ? (
        <EntityDetailView
            entity={question}
            entityType="שאלה"
            entityRoute="questions"
            updateMutation={updateQuestion}
            queryKey={['question', question.id]}
        />
    ) : (
        <Typography variant="h6">{LABELS.QUESTION_NOT_FOUND}</Typography>
    );
}
