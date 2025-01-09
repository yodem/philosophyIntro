import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi, termsApi, philosophersApi } from '../../api';
import { Card, CardContent, Box, Skeleton, Typography, Button } from '@mui/material';
import { useState } from 'react';
import { UpdateQuestionDto } from '@/types';
import { useTranslation } from 'react-i18next';
import { GenericForm } from '@/components/Forms/GenericForm';
import { FormInputs } from '@/types/form';

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
            const question = await questionsApi.getOne(Number(params.id));
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
    const { t } = useTranslation();
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
            relatedPhilosophers: data.relatedPhilosophers?.map((p: { id: number } | number) => typeof p === 'number' ? p : p.id),
            relatedQuestions: data.relatedQuestions?.map((q: { id: number } | number) => typeof q === 'number' ? q : q.id),
            relatedTerms: data.relatedTerms?.map((t: { id: number } | number) => typeof t === 'number' ? t : t.id),
        });
    };

    if (!question) return <Typography variant="h6">{t('questionNotFound')}</Typography>;

    return (
        <Box p={2}>
            <Button
                variant="outlined"
                onClick={() => setIsEditing(!isEditing)}
                sx={{ m: 2 }}
            >
                {t(isEditing ? 'view' : 'edit')}
            </Button>

            <GenericForm
                isEdit={true}
                isEditable={isEditing}
                defaultValues={question}
                entityType="Question"
                entityRoute="questions"
                relations={[
                    {
                        name: 'relatedTerms',
                        label: t('relatedTerms'),
                        options: allTerms || [],
                        baseRoute: 'terms'
                    },
                    {
                        name: 'relatedPhilosophers',
                        label: t('relatedPhilosophers'),
                        options: allPhilosophers || [],
                        baseRoute: 'philosophers'
                    },
                    {
                        name: 'relatedQuestions',
                        label: t('relatedQuestions'),
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
