import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { philosophersApi } from '../../api';
import { ContentType, ContentWithRelations } from '@/types';
import { GenericForm } from '../../components/Forms/GenericForm';
import { FormInputs } from '@/types/form';
import { useState } from 'react';

export const Route = createFileRoute('/philosophers/new')({
    component: NewPhilosopherComponent,
});

function NewPhilosopherComponent() {
    const queryClient = useQueryClient();
    const navigate = Route.useNavigate();
    const [isEditable, setIsEditable] = useState(true);

    const createPhilosopherMutation = useMutation({
        mutationFn: (newPhilosopher: Partial<ContentWithRelations>) => philosophersApi.create(newPhilosopher),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['philosophers'] });
            navigate({ to: data?.id ? `/philosophers/${data.id}` : '/philosophers' });
        },
    });

    const onSubmit = async (data: FormInputs) => {
        await createPhilosopherMutation.mutateAsync(data);
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
        type: ContentType.PHILOSOPHER
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
