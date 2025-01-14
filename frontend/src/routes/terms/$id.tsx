import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { termsApi, questionsApi, philosophersApi } from '../../api';
import { Card, CardContent, Box, Skeleton, Typography, Button } from '@mui/material';
import { UpdateTermDto } from '@/types';
import { useState } from 'react';
import { GenericForm } from '@/components/Forms/GenericForm';
import { FormInputs } from '@/types/form';
import { LABELS } from '@/constants';

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
            const term = await termsApi.getOne(params.id);
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
            associatedPhilosophers: data.associatedPhilosophers?.map(p => typeof p === 'object' ? p.id : p),
            associatedQuestions: data.associatedQuestions?.map(q => typeof q === 'object' ? q.id : q),
            associatedTerms: data.associatedTerms?.map(t => typeof t === 'object' ? t.id : t),
        });
    };

    if (!term) return <Typography variant="h6">{LABELS.TERM_NOT_FOUND}</Typography>;

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
                defaultValues={{
                    ...term,
                    images: term.images
                }}
                entityType="מושג"
                entityRoute="terms"
                relations={[
                    {
                        name: 'associatedQuestions',
                        label: LABELS.RELATED_QUESTIONS,
                        options: allQuestions || [],
                        baseRoute: 'questions'
                    },
                    {
                        name: 'associatedPhilosophers',
                        label: LABELS.RELATED_PHILOSOPHERS,
                        options: allPhilosophers || [],
                        baseRoute: 'philosophers'
                    },
                    {
                        name: 'associatedTerms',
                        label: LABELS.RELATED_TERMS,
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
