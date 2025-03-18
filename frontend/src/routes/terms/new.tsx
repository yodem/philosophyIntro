import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { termsApi } from '../../api';
import { ContentType } from '@/types';
import { GenericForm } from '@/components/Forms/GenericForm';
import { FormInputs } from '@/types/form';
import { useState } from 'react';
import { Content } from '@/types';

export const Route = createFileRoute('/terms/new')({
    component: NewTermComponent,
});

function NewTermComponent() {
    const queryClient = useQueryClient();
    const navigate = Route.useNavigate();
    const [isEditable, setIsEditable] = useState(true);

    const createTermMutation = useMutation({
        mutationFn: (newTerm: Content) => termsApi.create(newTerm),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['terms'] });
            navigate({ to: data?.id ? `/terms/${data.id}` : '/terms' });
        },
    });

    const onSubmit = async (data: FormInputs) => {
        return createTermMutation.mutateAsync(data)
    };

    const defaultValues: Content = {
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
