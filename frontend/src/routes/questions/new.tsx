import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { questionsApi, termsApi, philosophersApi } from '../../api';
import { UpdateQuestionDto } from '@/types';
import { GenericForm } from '@/components/Forms/GenericForm';
import { useTranslation } from 'react-i18next';
import { FormInputs } from '@/types/form';

export const Route = createFileRoute('/questions/new')({
    component: NewQuestionComponent,
});

function NewQuestionComponent() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const navigate = Route.useNavigate();

    const { data: allTerms } = useQuery({
        queryKey: ['terms'],
        queryFn: termsApi.getAll
    });

    const { data: allPhilosophers } = useQuery({
        queryKey: ['philosophers'],
        queryFn: philosophersApi.getAll
    });

    const createQuestionMutation = useMutation({
        mutationFn: (newQuestion: UpdateQuestionDto) => questionsApi.create(newQuestion),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            if (data?.id) {
                navigate({ to: '/questions/$id', params: { id: data.id.toString() } });
            } else {
                navigate({ to: '/questions' });
            }
        },
    });

    const onSubmit = async (data: FormInputs) => {
        return createQuestionMutation.mutateAsync({
            ...data,
            relatedPhilosophers: data.relatedPhilosophers?.map((p: { id: number } | number) => typeof p === 'number' ? p : p.id),
            relatedQuestions: data.relatedQuestions?.map((q: { id: number } | number) => typeof q === 'number' ? q : q.id),
            relatedTerms: data.relatedTerms?.map((t: { id: number } | number) => typeof t === 'number' ? t : t.id),
        });
    };

    return (
        <GenericForm
            defaultValues={{
                title: '',
                content: '',
                relatedTerms: [],
                relatedPhilosophers: [],
                relatedQuestions: []
            }}
            entityType="Question"
            entityRoute="questions"
            relations={[
                {
                    name: 'relatedTerms',
                    label: t('relatedTerms'),
                    options: allTerms || [],
                    baseRoute: 'terms'
                },
                {
                    name: 'relatedPhilosophers',
                    label: t('relatedPhilosophers'),
                    options: allPhilosophers || [],
                    baseRoute: 'philosophers'
                },
                {
                    name: 'relatedQuestions',
                    label: t('relatedQuestions'),
                    options: allQuestions || [],
                    baseRoute: 'questions'
                }
            ]}
            onSubmit={onSubmit}
        />
    );
}
