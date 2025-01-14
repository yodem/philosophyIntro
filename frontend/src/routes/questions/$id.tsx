import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi, termsApi, philosophersApi } from '../../api';
import { Card, CardContent, Box, Skeleton, Typography, Button } from '@mui/material';
import { useState } from 'react';
import { UpdateQuestionDto } from '@/types';
import { GenericForm } from '@/components/Forms/GenericForm';
import { FormInputs } from '@/types/form';
import { LABELS } from '@/constants';

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
    loader: async ({ params }) => {
        try {
            const question = await questionsApi.getOne(params.id);
            if (!question) throw new Error('Question not found');
            return question;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    pendingComponent: QuestionSkeleton,
    component: QuestionComponent,
});

function QuestionComponent() {
    const question = Route.useLoaderData();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);

    const { data: allTerms } = useQuery({
        queryKey: ['terms'],
        queryFn: termsApi.getAll
    });

    const { data: allPhilosophers } = useQuery({
        queryKey: ['philosophers'],
        queryFn: philosophersApi.getAll
    });

    const { data: allQuestions } = useQuery({
        queryKey: ['questions'],
        queryFn: questionsApi.getAll
    });

    const updateQuestionMutation = useMutation({
        mutationFn: (updatedQuestion: UpdateQuestionDto) => questionsApi.update(question!.id, updatedQuestion),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['question', question!.id]
            });
            setIsEditing(false);
        },
    });

    const onSubmit = async (data: FormInputs) => {
        if (!question) return;
        return updateQuestionMutation.mutateAsync({
            ...question,
            ...data,
            id: question.id,
            associatedPhilosophers: data.associatedPhilosophers?.map((p: { id: string } | string) => typeof p === 'string' ? p : p.id),
            associatedQuestions: data.associatedQuestions?.map((q: { id: string } | string) => typeof q === 'string' ? q : q.id),
            associatedTerms: data.associatedTerms?.map((t: { id: string } | string) => typeof t === 'string' ? t : t.id),
        });
    };

    if (!question) return <Typography variant="h6">{LABELS.QUESTION_NOT_FOUND}</Typography>;

    return (
        <Box p={2}>
            <Button
                variant="outlined"
                onClick={() => setIsEditing(!isEditing)}
                sx={{ m: 2 }}
            >
                {isEditing ? LABELS.VIEW : LABELS.EDIT}
            </Button>

            <GenericForm
                isEdit={true}
                isEditable={isEditing}
                defaultValues={question}
                entityType="Question"
                entityRoute="questions"
                relations={[
                    {
                        name: 'associatedTerms',
                        label: LABELS.RELATED_TERMS,
                        options: allTerms || [],
                        baseRoute: 'terms'
                    },
                    {
                        name: 'associatedPhilosophers',
                        label: LABELS.RELATED_PHILOSOPHERS,
                        options: allPhilosophers || [],
                        baseRoute: 'philosophers'
                    },
                    {
                        name: 'associatedQuestions',
                        label: LABELS.RELATED_QUESTIONS,
                        options: allQuestions || [],
                        baseRoute: 'questions'
                    }
                ]}
                onSubmit={onSubmit}
                setIsEditable={setIsEditing}
            />
        </Box>
    );
}
