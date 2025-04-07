import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import RelatedEntitiesList from '../ResourceDislpay/RelatedEntitiesList';
import { MetadataForm } from '../Forms/MetadataForm';
import { EntityDetailHeader } from '@/components/ContentDisplay/EntityDetailHeader';
import { ContentWithRelations } from '@/types';

interface EntityDetailContentProps {
    entity: ContentWithRelations;
    setIsEditable: (editable: boolean) => void;
}

export function EntityDetailContent({ entity, setIsEditable }: EntityDetailContentProps) {
    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <EntityDetailHeader
                title={entity.title}
                contentType={entity.contentTypeDisplayName}
                setIsEditable={setIsEditable}
            />

            {/* Description section */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                    {entity.description && (
                        <Typography variant="subtitle1" gutterBottom sx={{ fontStyle: 'italic', mb: 3 }}>
                            {entity.description}
                        </Typography>
                    )}

                    {/* Metadata section - using MetadataForm in read-only mode */}
                    {entity.metadata && Object.keys(entity.metadata).length > 0 && (
                        <MetadataForm
                            contentType={entity.type}
                            metadata={entity.metadata || {}}
                            isEditable={false}
                        />
                    )}
                </Grid>
                <Grid item xs={12} sm={6}>
                    {/* Main Image */}
                    {entity.full_picture && (
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                            <Box
                                component="img"
                                src={entity.full_picture}
                                alt={entity.title}
                                sx={{
                                    maxWidth: '100%',
                                    maxHeight: '400px',
                                    borderRadius: 1
                                }}
                            />
                        </Box>
                    )}
                </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" sx={{ mb: 2 }}>
                תוכן
            </Typography>
            {/* Main content */}
            <Typography
                variant="body1"
                component="div"
                className="content-html"
                dangerouslySetInnerHTML={{ __html: entity.content }}
                sx={{ mb: 4, lineHeight: 1.8 }}
            />
            <Divider sx={{ mb: 2 }} />

            {/* Related entities section */}
            <Box sx={{ mt: 4 }}>
                <RelatedEntitiesList entity={entity} />
            </Box>
        </Paper>
    );
}
