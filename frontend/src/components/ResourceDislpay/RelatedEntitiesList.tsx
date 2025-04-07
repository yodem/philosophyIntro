import { Box, Typography, Chip, Stack } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { ContentWithRelations, Content, ContentTypes } from '@/types';

interface RelatedEntitiesListProps {
    entity: ContentWithRelations;
}

export default function RelatedEntitiesList({ entity }: RelatedEntitiesListProps) {
    const navigate = useNavigate();

    // Map content types to display labels
    const typeDisplayInfo: Record<ContentTypes, { label: string }> = {
        'philosopher': { label: 'פילוסופים קשורים' },
        'question': { label: 'שאלות קשורות' },
        'term': { label: 'מושגים קשורים' },
    };

    // Extract all relation types we want to display
    const relationTypes = ['philosopher', 'question', 'term'] as ContentTypes[];

    // Create a map of relations by type
    const relatedContent: Record<string, Content[]> = {};

    // Collect relations by type
    relationTypes.forEach(type => {
        if (entity[type] && Array.isArray(entity[type]) && entity[type].length > 0) {
            relatedContent[type] = entity[type];
        }
    });

    // If no related content exists, return null
    if (Object.keys(relatedContent).length === 0) {
        return null;
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>קשרים</Typography>

            <Stack spacing={3}>
                {Object.entries(relatedContent).map(([type, contents]) => {
                    if (!contents || contents.length === 0) return null;

                    const typeInfo = typeDisplayInfo[type as ContentTypes];
                    if (!typeInfo) return null;

                    return (
                        <Box key={type}>
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium', color: 'text.secondary' }}>
                                {typeInfo.label}:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ p: 1, borderRadius: 1 }}>
                                {contents.map((related) => (
                                    <Chip
                                        key={related.id}
                                        label={related.title}
                                        onClick={() => navigate({
                                            to: "/content/$id",
                                            params: { id: related.id }
                                        })}
                                        clickable
                                        variant='outlined'
                                        sx={{ borderColor: 'primary.main' }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    );
                })}
            </Stack>
        </Box>
    );
}
