import { createFileRoute } from '@tanstack/react-router';
import { termsApi } from '../../api';
import { Card, CardContent, Box, Skeleton, Typography, Chip, Divider, List, ListItem, ListItemText } from '@mui/material';
import { EditableRichText } from '../../components/EditableRichText';

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

    if (!term) {
        return <Typography variant="h6">Term not found</Typography>;
    }

    const handleSave = async (content: string) => {
        await termsApi.update(term.id, { ...term, definition: content });
    };

    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {term.term}
                    </Typography>
                    <EditableRichText initialContent={term.definition} onSave={handleSave} />

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
