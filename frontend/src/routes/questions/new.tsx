import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi } from '../../api';
import { GenericForm } from '@/components/Forms/GenericForm';
import { FormInputs } from '@/types/form';
import { useState } from 'react';
import { Content, ContentType } from '@/types';

export const Route = createFileRoute('/questions/new')({
    component: NewQuestionComponent,
});

function NewQuestionComponent() {
    const queryClient = useQueryClient();
    const navigate = Route.useNavigate();
    const [isEditable, setIsEditable] = useState(true);

    const createQuestionMutation = useMutation({
        mutationFn: (newQuestion: Partial<Content>) => questionsApi.create(newQuestion),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            navigate({ to: data?.id ? `/questions/${data.id}` : '/questions' });
        },
    });

    const onSubmit = async (data: FormInputs) => {
        return createQuestionMutation.mutateAsync(data);
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
        type: ContentType.QUESTION
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
