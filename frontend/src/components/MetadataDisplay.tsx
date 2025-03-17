import { Stack, Chip } from '@mui/material';

interface MetadataDisplayProps {
    metadata: Record<string, string>;
}

export function MetadataDisplay({ metadata }: MetadataDisplayProps) {
    if (!metadata) return null;

    return (
        <Stack direction="row" spacing={1} mb={2}>
            {Object.entries(metadata).map(([key, value]) => (
                <Chip key={key} label={`${key}: ${value}`} variant="outlined" />
            ))}
        </Stack>
    );
}
