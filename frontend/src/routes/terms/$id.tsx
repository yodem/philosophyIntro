import { createFileRoute } from '@tanstack/react-router';
import { termsApi } from '../../api';
import { Card, CardContent, Box, Skeleton, Typography, Chip, Divider, List, ListItem, ListItemText } from '@mui/material';
import { RichTextEditor } from '../../components/RichTextEditor';
import { useState, useEffect } from 'react';

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
    const term = Route.useLoaderData();
    const [description, setDescription] = useState(term?.definition || '');

    useEffect(() => {
        if (term) {
            setDescription(term.definition);
        }
    }, [term]);

    if (!term) {
        return <Typography variant="h6">Term not found</Typography>;
    }

    const handleSave = async () => {
        await termsApi.update(term.id, { ...term, definition: description });
    };

    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {term.term}
                    </Typography>
                    <RichTextEditor content={description} onChange={setDescription} />
                    <button onClick={handleSave}>Save</button>

                    {term.philosophers && term.philosophers.length > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>Key Philosophers</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {term.philosophers.map(philosopher => (
                                    <Chip
                                        key={philosopher.id}
                                        label={philosopher.name}
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </>
                    )}

                    {term.questions && term.questions.length > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>Related Questions</Typography>
                            <List>
                                {term.questions.map(question => (
                                    <ListItem key={question.id}>
                                        <ListItemText
                                            primary={question.question}
                                            secondary={question.description}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
