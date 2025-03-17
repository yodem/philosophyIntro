import { useState } from 'react';
import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import { Content } from '@/types';
import { FormInputs } from '@/types/form';
import { GenericForm } from './Forms/GenericForm';
import { Edit } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import RelatedEntitiesList from './RelatedEntitiesList';

interface EntityDetailViewProps {
    entity: Content;
    entityType: string;
    entityRoute: string;
    updateMutation: (id: string, data: Partial<Content>) => Promise<Content | undefined>;
    queryKey: Array<string>;
}

export function EntityDetailView({
    entity,
    entityType,
    updateMutation,
    queryKey,
}: EntityDetailViewProps) {
    const [isEditable, setIsEditable] = useState(false);
    const queryClient = useQueryClient();

    const { mutateAsync: update } = useMutation({
        mutationFn: (data: FormInputs) => updateMutation(entity.id, data),
        onSuccess: () => {
            // Use the provided queryKey for invalidation
            queryClient.invalidateQueries({ queryKey });

            // Also invalidate the content query with the same ID
            queryClient.invalidateQueries({ queryKey: ['content', entity.id] });

            setIsEditable(false);
        },
    });

    const handleSubmit = async (data: FormInputs) => {
        try {
            await update(data);
        } catch (error) {
            console.error(`Failed to update ${entityType}:`, error);
        }
    };

    return (
        <Box p={2}>
            {!isEditable ? (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h4" component="h1">{entity.title}</Typography>
                        <Button
                            variant="outlined"
                            startIcon={<Edit size={18} />}
                            onClick={() => setIsEditable(true)}
                        >
                            עריכה
                        </Button>
                    </Box>

                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            {entity.description && (
                                <Typography variant="body1" sx={{ mb: 2 }}>{entity.description}</Typography>
                            )}

                            {entity.full_picture && (
                                <Box sx={{ mb: 2 }}>
                                    <img
                                        src={entity.full_picture}
                                        alt={entity.title}
                                        style={{ maxWidth: '100%', borderRadius: '4px' }}
                                    />
                                </Box>
                            )}

                            <Typography variant="body1" sx={{ mb: 2 }} dangerouslySetInnerHTML={{ __html: entity.content }} />
                            <RelatedEntitiesList entity={entity} />
                        </CardContent>
                    </Card>
                </>
            ) : (
                <GenericForm
                    defaultValues={entity}
                    isEditable={isEditable}
                    setIsEditable={setIsEditable}
                    onSubmit={handleSubmit}
                />
            )}
        </Box>
    );
}
