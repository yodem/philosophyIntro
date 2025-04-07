import { ContentWithRelations } from '@/types';
import { Chip, Box, Typography } from '@mui/material';

interface MetadataDisplayProps {
    metadata: ContentWithRelations['metadata'];
}

export function MetadataDisplay({ metadata }: MetadataDisplayProps) {
    if (!metadata || Object.keys(metadata).length === 0) return null;

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>מידע נוסף</Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                }}
            >
                {Object.entries(metadata).map(([key, value]) => {
                    // Skip empty values
                    if (!value) return null;

                    // Format keys for display
                    const displayKey = {
                        'era': 'תקופה',
                        'birthDate': 'תאריך לידה',
                        'deathDate': 'תאריך פטירה',
                        'nationality': 'לאום'
                    }[key] || key;

                    return (
                        <Chip
                            key={key}
                            label={`${displayKey}: ${value}`}
                            variant="outlined"
                            sx={{ bgcolor: 'background.paper' }}
                        />
                    );
                })}
            </Box>
        </Box>
    );
}
