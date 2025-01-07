import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi, termsApi, philosophersApi } from '../../api';
import { Card, CardContent, Box, Skeleton, Typography, Avatar, Divider } from '@mui/material';
import { EditableRichText } from '../../components/EditableRichText';
import { AutocompleteWithButton } from '../../components/AutocompleteWithButton';
import { useState } from 'react';
import { Term, Philosopher, UpdateQuestionDto } from '@/types';
import { RouterChip } from '../../components/routerComponents/RouterChip';

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
    const question = Route.useLoaderData();
    const queryClient = useQueryClient();
    const [selectedTerms, setSelectedTerms] = useState(question?.terms || []);
    const [selectedPhilosophers, setSelectedPhilosophers] = useState(question?.philosophers || []);

    const { data: allTerms } = useQuery({
        queryKey: ['terms'],
        queryFn: termsApi.getAll
    });

    const { data: allPhilosophers } = useQuery({
        queryKey: ['philosophers'],
        queryFn: philosophersApi.getAll
    });

    const updateQuestionMutation = useMutation({
        mutationFn: (updatedQuestion: UpdateQuestionDto) => questionsApi.update(question!.id, updatedQuestion),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['question', question!.id]
            });
        },
    });

    const handleSave = async (content: string) => {
        if (question) {
            updateQuestionMutation.mutate({
                ...question,
                description: content,
                terms: selectedTerms.map(t => t.id),
                philosophers: selectedPhilosophers.map(p => p.id)
            });
        }
    };

    const handleTermsChange = (_: React.SyntheticEvent, value: Term[]) => {
        setSelectedTerms(value);
    };

    const handlePhilosophersChange = (_: React.SyntheticEvent, value: Philosopher[]) => {
        setSelectedPhilosophers(value);
    };

    const handleSaveAdditionalData = async () => {
        if (question) {
            updateQuestionMutation.mutate({
                ...question,
                terms: selectedTerms.map(t => t.id),
                philosophers: selectedPhilosophers.map(p => p.id)
            });
        }
    };

    if (!question) {
        return <Typography variant="h6">Question not found</Typography>;
    }

    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {question.question}
                    </Typography>
                    <EditableRichText initialContent={question.description} onSave={handleSave} />

                    <AutocompleteWithButton
                        options={allTerms || []}
                        getOptionLabel={(option) => option.term}
                        value={selectedTerms}
                        onChange={handleTermsChange}
                        label="Related Terms"
                        onSave={handleSaveAdditionalData}
                    />

                    <AutocompleteWithButton
                        options={allPhilosophers || []}
                        getOptionLabel={(option) => option.name}
                        value={selectedPhilosophers}
                        onChange={handlePhilosophersChange}
                        label="Discussed by"
                        onSave={handleSaveAdditionalData}
                    />

                    {question.philosophers && question.philosophers.length > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>Discussed by</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {question.philosophers.map(philosopher => (
                                    <RouterChip
                                        key={philosopher.id}
                                        avatar={<Avatar>{philosopher.name[0]}</Avatar>}
                                        label={philosopher.name}
                                        variant='outlined'
                                        to={"/philosophers/$id"}
                                        params={{ id: philosopher.id.toString() }}
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
                                    <RouterChip
                                        key={term.id}
                                        label={term.term}
                                        variant="outlined"
                                        to={"/terms/$id"}
                                        params={{ id: term.id.toString() }}
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
