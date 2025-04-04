import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { termsApi } from '../../api';
import { ContentType, ContentWithRelations } from '@/types';
import { GenericForm } from '@/components/Forms/GenericForm';
import { FormInputs } from '@/types/form';
import { useState } from 'react';

export const Route = createFileRoute('/terms/new')({
    component: NewTermComponent,
});

function NewTermComponent() {
    const queryClient = useQueryClient();
    const navigate = Route.useNavigate();
    const [isEditable, setIsEditable] = useState(true);

    const createTermMutation = useMutation({
        mutationFn: (newTerm: Partial<ContentWithRelations>) => termsApi.create(newTerm),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['terms'] });
            navigate({ to: data?.id ? `/terms/${data.id}` : '/terms' });
        },
    });

    const onSubmit = async (data: FormInputs) => {
        await createTermMutation.mutateAsync(data);
        return; // explicitly return void
    };

    const defaultValues: ContentWithRelations = {
        id: '',
        title: '',
        content: '',
        description: '',
        full_picture: '',
        description_picture: '',
        philosopher: [],
        question: [],
        term: [],
        type: ContentType.TERM
    };

    return (
        <GenericForm
            defaultValues={defaultValues}
            isEditable={isEditable}
            setIsEditable={setIsEditable}
            onSubmit={onSubmit}
        />
    );
}
