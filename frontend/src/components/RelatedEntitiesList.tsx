import { Box, Typography, Chip, Divider } from '@mui/material';
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
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>קשרים</Typography>

            {relatedTypes.map(type => {
                const relatedEntities = entity[type.type as keyof Content] as Content[] | undefined;

                if (!relatedEntities || !Array.isArray(relatedEntities) || relatedEntities.length === 0) {
                    return null;
                }

                return (
                    <Box key={type.type} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">{type.label}:</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {relatedEntities.map(related => (
                                <Chip
                                    key={related.id}
                                    label={related.title}
                                    onClick={() => navigate({ to: `/${type.route}/$id`, params: { id: related.id } })}
                                    sx={{ cursor: 'pointer' }}
                                />
                            ))}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}
