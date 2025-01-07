import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { termsApi, questionsApi, philosophersApi } from '../../api';
import { Card, CardContent, Box, Skeleton, Typography, Divider } from '@mui/material';
import { EditableRichText } from '../../components/EditableRichText';
import { AutocompleteWithButton } from '../../components/AutocompleteWithButton';
import { useState } from 'react';
import { Question, Philosopher, UpdateTermDto } from '@/types';
import { RouterChip } from '../../components/routerComponents/RouterChip';

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
    const term = Route.useLoaderData()!;
    const queryClient = useQueryClient();
    const [selectedQuestions, setSelectedQuestions] = useState(term?.questions || []);
    const [selectedPhilosophers, setSelectedPhilosophers] = useState(term?.philosophers || []);

    const { data: allQuestions } = useQuery({
        queryKey: ['questions'],
        queryFn: questionsApi.getAll
    });

    const { data: allPhilosophers } = useQuery({
        queryKey: ['philosophers'],
        queryFn: philosophersApi.getAll
    });

    const updateTermMutation = useMutation({
        mutationFn: (updatedTerm: UpdateTermDto) => termsApi.update(term.id, updatedTerm),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['term', term.id]
            });
        },
    });

    const handleSave = async (content: string) => {
        if (term) {
            updateTermMutation.mutate({
                ...term,
                definition: content,
                questions: selectedQuestions.map(q => q.id),
                philosophers: selectedPhilosophers.map(p => p.id)
            });
        }
    };

    const handleQuestionsChange = (_: React.SyntheticEvent, value: Question[]) => {
        setSelectedQuestions(value);
    };

    const handlePhilosophersChange = (_: React.SyntheticEvent, value: Philosopher[]) => {
        setSelectedPhilosophers(value);
    };

    const handleSaveAdditionalData = async () => {
        if (term) {
            updateTermMutation.mutate({
                ...term,
                questions: selectedQuestions.map(q => q.id),
                philosophers: selectedPhilosophers.map(p => p.id)
            });
        }
    };

    if (!term) {
        return <Typography variant="h6">Term not found</Typography>;
    }

    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {term.term}
                    </Typography>
                    <EditableRichText initialContent={term.definition} onSave={handleSave} />

                    <AutocompleteWithButton
                        options={allQuestions || []}
                        getOptionLabel={(option) => option.question}
                        value={selectedQuestions}
                        onChange={handleQuestionsChange}
                        label="Related Questions"
                        onSave={handleSaveAdditionalData}
                    />

                    <AutocompleteWithButton
                        options={allPhilosophers || []}
                        getOptionLabel={(option) => option.name}
                        value={selectedPhilosophers}
                        onChange={handlePhilosophersChange}
                        label="Key Philosophers"
                        onSave={handleSaveAdditionalData}
                    />

                    {term.philosophers && term.philosophers.length > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>Key Philosophers</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {term.philosophers.map(philosopher => (
                                    <RouterChip
                                        key={philosopher.id}
                                        label={philosopher.name}
                                        variant="outlined"
                                        to={"/philosophers/$id"}
                                        params={{ id: philosopher.id.toString() }}
                                    />
                                ))}
                            </Box>
                        </>
                    )}

                    {term.questions && term.questions.length > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>Related Questions</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {term.questions.map(question => (
                                    <RouterChip
                                        key={question.id}
                                        label={question.question}
                                        variant='outlined'
                                        to={"/questions/$id"}
                                        params={{ id: question.id.toString() }}
                                    />
                                ))}
                            </Box>
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
