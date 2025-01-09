import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { questionsApi, termsApi, philosophersApi } from '../../api';
import { Question, UpdateQuestionDto } from '@/types';
import { QuestionForm } from '@/components/Forms/QuestionForm';

export const Route = createFileRoute('/questions/new')({
    component: NewQuestionComponent,
});

function NewQuestionComponent() {
    const navigate = Route.useNavigate();
    const queryClient = useQueryClient();

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

    const onSubmit = async (data: UpdateQuestionDto): Promise<Question | undefined> => {
        return createQuestionMutation.mutateAsync(data);
    };

    return (
        <QuestionForm
            defaultValues={{
                title: '',
                content: '',
                relatedTerms: [],
                relatedPhilosophers: []
            }}
            allTerms={allTerms || []}
            allPhilosophers={allPhilosophers || []}
            onSubmit={onSubmit}
        />
    );
}
