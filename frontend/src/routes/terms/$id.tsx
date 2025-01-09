import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { termsApi, questionsApi, philosophersApi } from '../../api';
import { Card, CardContent, Box, Skeleton, Typography, Button } from '@mui/material';
import { UpdateTermDto } from '@/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GenericForm } from '@/components/Forms/GenericForm';
import { FormInputs } from '@/types/form';

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
    loader: async ({ params }) => {
        try {
            const term = await termsApi.getOne(Number(params.id));
            if (!term) throw new Error('Term not found');
            return term;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    pendingComponent: TermSkeleton,
    component: TermComponent,
});

function TermComponent() {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const term = Route.useLoaderData();
    const queryClient = useQueryClient();

    const { data: allQuestions } = useQuery({
        queryKey: ['questions'],
        queryFn: questionsApi.getAll
    });

    const { data: allPhilosophers } = useQuery({
        queryKey: ['philosophers'],
        queryFn: philosophersApi.getAll
    });

    const { data: allTerms } = useQuery({
        queryKey: ['terms'],
        queryFn: termsApi.getAll
    });

    const updateTermMutation = useMutation({
        mutationFn: (updatedTerm: UpdateTermDto) => termsApi.update(term!.id, updatedTerm),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['term', term!.id]
            });
            setIsEditing(false);
        },
    });

    const onSubmit = async (data: FormInputs) => {
        if (!term) return;
        return updateTermMutation.mutateAsync({
            ...term,
            ...data,
            id: term.id,
            relatedPhilosophers: data.relatedPhilosophers?.map((p: { id: number } | number) => typeof p === 'number' ? p : p.id),
            relatedQuestions: data.relatedQuestions?.map((q: { id: number } | number) => typeof q === 'number' ? q : q.id),
            relatedTerms: data.relatedTerms?.map((t: { id: number } | number) => typeof t === 'number' ? t : t.id),
        });
    };

    if (!term) return <Typography variant="h6">{t('termNotFound')}</Typography>;

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
                defaultValues={term}
                entityType="Term"
                entityRoute="terms"
                relations={[
                    {
                        name: 'relatedQuestions',
                        label: t('relatedQuestions'),
                        options: allQuestions || [],
                        baseRoute: 'questions'
                    },
                    {
                        name: 'relatedPhilosophers',
                        label: t('relatedPhilosophers'),
                        options: allPhilosophers || [],
                        baseRoute: 'philosophers'
                    },
                    {
                        name: 'relatedTerms',
                        label: t('relatedTerms'),
                        options: allTerms || [],
                        baseRoute: 'terms'
                    }
                ]}
                onSubmit={onSubmit}
                setIsEditable={setIsEditing}
            />
        </Box>
    );
}
