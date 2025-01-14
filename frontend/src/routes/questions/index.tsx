import { createFileRoute } from '@tanstack/react-router';
import { questionsApi } from '@/api';
import { Button } from '@mui/material';
import ResourceCard from '@/components/ResourceCard'; // Import the generic component
import ResourceGrid from '@/components/ResourceGrid'; // Import the generic grid component
import ResourceSkeleton from '@/components/ResourceSkeleton';
import { LABELS } from '@/constants';

function QuestionsSkeleton() {
    return (
        <ResourceGrid>
            {[1, 2, 3, 4].map((i) => (
                <ResourceSkeleton key={i} />
            ))}
        </ResourceGrid>
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
                {LABELS.ADD_NEW_QUESTION}
            </Button>
            <ResourceGrid>
                {questions?.map((question) => (
                    <ResourceCard
                        key={question.id}
                        resource={question}
                        onClick={() => navigate({ to: '/questions/$id', params: { id: question.id.toString() } })}
                    />
                ))}
            </ResourceGrid>
        </>
    );
}
