import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { termsApi, questionsApi, philosophersApi } from '../../api';
import { TermForm } from '../../components/Forms/TermForm';
import { UpdateTermDto } from '@/types';

export const Route = createFileRoute('/terms/new')({
    component: NewTermComponent,
});

function NewTermComponent() {
    const navigate = Route.useNavigate();
    const queryClient = useQueryClient();

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

    const onSubmit = async (data: UpdateTermDto) => {
        return createTermMutation.mutateAsync(data);
    };

    return (
        <TermForm
            defaultValues={{
                title: '',
                content: '',
                relatedQuestions: [],
                relatedPhilosophers: []
            }}
            allQuestions={allQuestions || []}
            allPhilosophers={allPhilosophers || []}
            onSubmit={onSubmit}
        />
    );
}
