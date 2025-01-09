import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { termsApi, questionsApi, philosophersApi } from '../../api';
import { UpdateTermDto } from '@/types';
import { GenericForm } from '@/components/Forms/GenericForm';
import { useTranslation } from 'react-i18next';
import { FormInputs } from '@/types/form';

export const Route = createFileRoute('/terms/new')({
    component: NewTermComponent,
});

function NewTermComponent() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const navigate = Route.useNavigate();

    const { data: allQuestions } = useQuery({
        queryKey: ['questions'],
        queryFn: questionsApi.getAll
    });

    const { data: allPhilosophers } = useQuery({
        queryKey: ['philosophers'],
        queryFn: philosophersApi.getAll
    });

    const createTermMutation = useMutation({
        mutationFn: (newTerm: UpdateTermDto) => termsApi.create(newTerm),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['terms'] });
            if (data?.id) {
                navigate({ to: '/terms/$id', params: { id: data.id.toString() } });
            } else {
                navigate({ to: '/terms' });
            }
        },
    });

    const onSubmit = async (data: FormInputs) => {
        return createTermMutation.mutateAsync({
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
                relatedQuestions: [],
                relatedPhilosophers: [],
                relatedTerms: []
            }}
            entityType="Term"
            entityRoute="terms"
            relations={[
                {
                    name: 'relatedQuestions',
                    label: t('relatedQuestions'),
                    options: allQuestions || [],
                    baseRoute: 'questions'
                },
                {
                    name: 'relatedPhilosophers',
                    label: t('relatedPhilosophers'),
                    options: allPhilosophers || [],
                    baseRoute: 'philosophers'
                },
                {
                    name: 'relatedTerms',
                    label: t('relatedTerms'),
                    options: allTerms || [],
                    baseRoute: 'terms'
                }
            ]}
            onSubmit={onSubmit}
        />
    );
}
