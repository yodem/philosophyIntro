import { Card, CardContent, Box, Typography, Chip, Stack } from '@mui/material';
import { RelatedItems } from './RelatedItems';
import { BasicEntity } from '@/types';

interface EntityDisplayProps {
    title: string;
    content: string;
    metadata?: Array<{ label: string; value: string }>;
    relations?: Array<{
        title: string;
        items: BasicEntity[];
        getLabel: (item: BasicEntity) => string;
        getLink: (item: BasicEntity) => { to: string; params: { id: string } };
    }>;
    imageUrl?: string;
}

export function EntityDisplay({ title, content, relations = [], metadata = [], imageUrl }: EntityDisplayProps) {

    return (
        <Box key={title} p={2}>
            <Card>
                <CardContent>
                    {imageUrl && (
                        <Box
                            component="img"
                            src={imageUrl}
                            alt={title}
                            sx={{ aspectRatio: "3/4", mb: 2 }}
                        />
                    )}
                    <Typography variant="h4" gutterBottom>{title}</Typography>

                    {metadata.length > 0 && (
                        <Stack direction="row" spacing={1} mb={2}>
                            {metadata.map(({ label, value }) => (
                                <Chip key={label} label={`${label}: ${value}`} variant="outlined" />
                            ))}
                        </Stack>
                    )}

                    <div dir='rtl' dangerouslySetInnerHTML={{ __html: content }} />

                    {relations.map((relation) => (
                        <RelatedItems
                            key={relation.title}
                            title={relation.title}
                            items={relation.items}
                            getLabel={relation.getLabel}
                            getLink={relation.getLink}
                        />
                    ))}
                </CardContent>
            </Card>
        </Box>
    );
}
