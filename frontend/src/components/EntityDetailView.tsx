import { useState } from 'react';
import { Box } from '@mui/material';
import { Content } from '@/types';
import { FormInputs } from '@/types/form';
import { GenericForm } from './Forms/GenericForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EntityDetailDisplay } from './ContentDisplay/EntityDetailDisplay';

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
