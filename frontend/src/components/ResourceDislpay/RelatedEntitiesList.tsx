import { Box, Typography, Chip, Stack } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { Content } from '@/types';

interface RelatedEntitiesListProps {
    entity: Content;
}

export default function RelatedEntitiesList({ entity }: RelatedEntitiesListProps) {
    const navigate = useNavigate();

    const relatedTypes = [
        { type: 'philosopher', label: 'פילוסופים קשורים', route: 'philosophers' },
        { type: 'question', label: 'שאלות קשורות', route: 'questions' },
        { type: 'term', label: 'מושגים קשורים', route: 'terms' },
    ];

    const hasRelatedEntities = relatedTypes.some(
        type => entity[type.type as keyof Content] &&
            Array.isArray(entity[type.type as keyof Content]) &&
            (entity[type.type as keyof Content] as Content[]).length > 0
    );

    if (!hasRelatedEntities) return null;

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>קשרים</Typography>

            <Stack spacing={3}>
                {relatedTypes.map(type => {
                    const relatedEntities = entity[type.type as keyof Content] as Content[] | undefined;

                    if (!relatedEntities || !Array.isArray(relatedEntities) || relatedEntities.length === 0) {
                        return null;
                    }

                    return (
                        <Box key={type.type}>
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium', color: 'text.secondary' }}>
                                {type.label}:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ p: 1, borderRadius: 1 }}>
                                {relatedEntities.map(related => (
                                    <Chip
                                        key={related.id}
                                        label={related.title}
                                        onClick={() => navigate({ to: `/${type.route}/$id`, params: { id: related.id } })}
                                        clickable
                                        variant='outlined'
                                        sx={{
                                            borderColor: 'primary.main',
                                        }}
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
