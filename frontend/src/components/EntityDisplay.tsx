import { Card, CardContent, Box, Typography } from '@mui/material';
import { RelatedItems } from './RelatedItems';
import { Content } from '@/types';
import { MetadataDisplay } from './MetadataDisplay';

interface EntityDisplayProps {
    contentData: Content;

}

export function EntityDisplay({ contentData }: EntityDisplayProps) {
    const { title, content, metadata, full_picture, philosopher, question, term } = contentData;

    const philosopherRelation = {
        title: "פילוסופים",
        items: philosopher || [],
        getLabel: (item: Content) => item.title,
        getLink: (item: Content) => ({ to: "/philosophers/$id", params: { id: item.id } }),
    };

    const questionRelation = {
        title: "שאלות",
        items: question || [],
        getLabel: (item: Content) => item.title,
        getLink: (item: Content) => ({ to: "/questions/$id", params: { id: item.id } }),
    };

    const termRelation = {
        title: "מושגים",
        items: term || [],
        getLabel: (item: Content) => item.title,
        getLink: (item: Content) => ({ to: "/terms/$id", params: { id: item.id } }),
    };

    const relations = [philosopherRelation, questionRelation, termRelation];


    return (
        <Box key={title} p={2}>
            <Card>
                <CardContent>
                    {full_picture && (
                        <Box
                            component="img"
                            src={full_picture}
                            alt={title}
                            sx={{ aspectRatio: "3/4", mb: 2 }}
                        />
                    )}
                    <Typography variant="h4" gutterBottom>
                        {title}
                    </Typography>
                    <MetadataDisplay metadata={metadata || {}} />
                    <div dir="rtl" dangerouslySetInnerHTML={{ __html: content }} />
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
