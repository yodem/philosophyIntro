import { useState } from 'react';
import { Box } from '@mui/material';
import { ContentWithRelations } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EntityDetailDisplay } from './ContentDisplay/EntityDetailDisplay';
import { GenericForm } from './Forms/GenericForm';

interface EntityDetailViewProps {
    entity: ContentWithRelations;
    updateMutation: (id: string, data: Partial<ContentWithRelations>) => Promise<ContentWithRelations | undefined>;
    queryKey: Array<string>;
}

export function EntityDetailView({
    entity,
    updateMutation,
    queryKey,
}: EntityDetailViewProps) {
    const [isEditable, setIsEditable] = useState(false);
    const queryClient = useQueryClient();

    const { mutateAsync: update } = useMutation({
        mutationFn: (data: Partial<ContentWithRelations>) => updateMutation(entity.id, data),
        onSuccess: () => {
            // Use the provided queryKey for invalidation
            queryClient.invalidateQueries({ queryKey });

            // Also invalidate the content query with the same ID
            queryClient.invalidateQueries({ queryKey: ['content', entity.id] });

            setIsEditable(false);
        },
    });

    const handleSubmit = async (data: Partial<ContentWithRelations>) => {
        try {
            await update(data);
        } catch (error) {
            console.error(`Failed to update ${entity.type}:`, error);
        }
    };

    if (isEditable) {
        return (
            <Box p={2}>
                <GenericForm
                    defaultValues={entity}
                    isEditable={isEditable}
                    setIsEditable={setIsEditable}
                    onSubmit={handleSubmit}
                />
            </Box>
        );
    }

    return (
        <EntityDetailDisplay entity={entity} setIsEditable={setIsEditable} />
    );
}
