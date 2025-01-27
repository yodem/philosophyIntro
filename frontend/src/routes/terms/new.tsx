import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { termsApi, questionsApi, philosophersApi } from '../../api';
import { UpdateTermDto } from '@/types';
import { GenericForm } from '@/components/Forms/GenericForm';
import { LABELS } from '@/constants';
import { FormInputs } from '@/types/form';

export const Route = createFileRoute('/terms/new')({
    component: NewTermComponent,
});

function NewTermComponent() {
    const queryClient = useQueryClient();
    const navigate = Route.useNavigate();

    const { data: allQuestions } = useQuery({
        queryKey: ['questions'],
        queryFn: () => questionsApi.getAll()
    });

    const { data: allPhilosophers } = useQuery({
        queryKey: ['philosophers'],
        queryFn: () => philosophersApi.getAll()
    });

    const { data: allTerms } = useQuery({
        queryKey: ['terms'],
        queryFn: () => termsApi.getAll()
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
            associatedPhilosophers: data.associatedPhilosophers?.map(p => typeof p === 'object' ? p.id : p),
            associatedQuestions: data.associatedQuestions?.map(q => typeof q === 'object' ? q.id : q),
            associatedTerms: data.associatedTerms?.map(t => typeof t === 'object' ? t.id : t),
        });
    };

    return (
        <GenericForm
            defaultValues={{
                title: '',
                content: '',
                description: '',
                associatedQuestions: [],
                associatedPhilosophers: [],
                associatedTerms: []
            }}
            entityType="מושג"
            entityRoute="terms"
            relations={[
                {
                    name: 'associatedQuestions',
                    label: LABELS.RELATED_QUESTIONS,
                    options: allQuestions?.items || [],
                    baseRoute: 'questions'
                },
                {
                    name: 'associatedPhilosophers',
                    label: LABELS.RELATED_PHILOSOPHERS,
                    options: allPhilosophers?.items || [],
                    baseRoute: 'philosophers'
                },
                {
                    name: 'associatedTerms',
                    label: LABELS.RELATED_TERMS,
                    options: allTerms?.items || [],
                    baseRoute: 'terms'
                }
            ]}
            onSubmit={onSubmit}
        />
    );
}
