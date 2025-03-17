import { Chip, Box } from '@mui/material';

interface MetadataDisplayProps {
    metadata: Record<string, string>;
}

export function MetadataDisplay({ metadata }: MetadataDisplayProps) {
    if (!metadata) return null;

    return (<Box
        sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mb: 3
        }}>
        {Object.entries(metadata).map(([key, value]) => (
            <Chip key={key} label={`${key}: ${value}`} variant="outlined" />
        ))}
    </Box>
    );
}
