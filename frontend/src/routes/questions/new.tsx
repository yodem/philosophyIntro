import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { questionsApi, termsApi, philosophersApi } from '../../api';
import { UpdateQuestionDto } from '@/types';
import { GenericForm } from '@/components/Forms/GenericForm';
import { FormInputs } from '@/types/form';
import { LABELS } from '@/constants';

export const Route = createFileRoute('/questions/new')({
    component: NewQuestionComponent,
});

function NewQuestionComponent() {
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

    const { data: allQuestions } = useQuery({
        queryKey: ['questions'],
        queryFn: questionsApi.getAll
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
            associatedPhilosophers: data.associatedPhilosophers?.map((p: { id: string } | string) => typeof p === 'string' ? p : p.id),
            associatedQuestions: data.associatedQuestions?.map((q: { id: string } | string) => typeof q === 'string' ? q : q.id),
            associatedTerms: data.associatedTerms?.map((t: { id: string } | string) => typeof t === 'string' ? t : t.id),
        });
    };

    return (
        <GenericForm
            defaultValues={{
                title: '',
                content: '',
                associatedTerms: [],
                associatedPhilosophers: [],
                associatedQuestions: []
            }}
            entityType="Question"
            entityRoute="questions"
            relations={[
                {
                    name: 'associatedTerms',
                    label: LABELS.RELATED_TERMS,
                    options: allTerms || [],
                    baseRoute: 'terms'
                },
                {
                    name: 'associatedPhilosophers',
                    label: LABELS.RELATED_PHILOSOPHERS,
                    options: allPhilosophers || [],
                    baseRoute: 'philosophers'
                },
                {
                    name: 'associatedQuestions',
                    label: LABELS.RELATED_QUESTIONS,
                    options: allQuestions || [],
                    baseRoute: 'questions'
                }
            ]}
            onSubmit={onSubmit}
        />
    );
}
