import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { termsApi, questionsApi, philosophersApi } from '../../api';
import { Card, CardContent, Box, Skeleton, Typography, Button } from '@mui/material';
import { UpdateTermDto } from '@/types';
import { TermForm } from '../../components/Forms/TermForm';
import { useState } from 'react';

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

    const updateTermMutation = useMutation({
        mutationFn: (updatedTerm: UpdateTermDto) => termsApi.update(term!.id, updatedTerm),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['term', term!.id]
            });
            setIsEditing(false);
        },
    });

    const onSubmit = async (data: UpdateTermDto) => {
        if (!term) return;
        return updateTermMutation.mutateAsync({ ...term, ...data });
    };

    if (!term) return <Typography variant="h6">Term not found</Typography>;

    return (
        <>
            <Button
                variant="outlined"
                onClick={() => setIsEditing(!isEditing)}
                sx={{ m: 2 }}
            >
                {isEditing ? 'View' : 'Edit'}
            </Button>

            <TermForm
                isEdit={true}
                isEditable={isEditing}
                defaultValues={{
                    term: term.term,
                    definition: term.definition,
                    questions: term.questions || [],
                    philosophers: term.philosophers || []
                }}
                allQuestions={allQuestions || []}
                allPhilosophers={allPhilosophers || []}
                onSubmit={isEditing ? onSubmit : undefined}
            />
        </>
    );
}
