import { Card, CardContent, Box, Typography, Chip, Stack } from '@mui/material';
import { RelatedItems } from './RelatedItems';

interface EntityDisplayProps {
    title: string;
    content: string;
    relations?: {
        title: string;
        items: any[];
        getLabel: (item: any) => string;
        getLink: (item: any) => { to: string; params: { id: string } };
    }[];
    metadata?: {
        label: string;
        value: string | number;
    }[];
}

export function EntityDisplay({ title, content, relations = [], metadata = [] }: EntityDisplayProps) {
    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>{title}</Typography>

                    {metadata.length > 0 && (
                        <Stack direction="row" spacing={1} mb={2}>
                            {metadata.map(({ label, value }) => (
                                <Chip key={label} label={`${label}: ${value}`} variant="outlined" />
                            ))}
                        </Stack>
                    )}

                    <div dangerouslySetInnerHTML={{ __html: content }} />

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
