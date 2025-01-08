import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { philosophersApi, termsApi, questionsApi } from '../../api';
import { UpdatePhilosopherDto } from '@/types';
import dayjs from 'dayjs';
import { PhilosopherForm } from '../../components/Forms/PhilosopherForm';

export const Route = createFileRoute('/philosophers/new')({
    component: NewPhilosopherComponent,
});


function NewPhilosopherComponent() {
    const queryClient = useQueryClient();
    const navigate = Route.useNavigate();

    const { data: allTerms } = useQuery({
        queryKey: ['terms'],
        queryFn: termsApi.getAll
    });

    const { data: allQuestions } = useQuery({
        queryKey: ['questions'],
        queryFn: questionsApi.getAll
    });

    const createPhilosopherMutation = useMutation({
        mutationFn: (newPhilosopher: UpdatePhilosopherDto) => philosophersApi.create(newPhilosopher),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['philosophers'] });
            if (data?.id) {
                navigate({ to: '/philosophers/$id', params: { id: data.id.toString() } });
            } else {
                navigate({ to: '/philosophers' });
            }
        },
    });

    const onSubmit = async (data: UpdatePhilosopherDto) => {
        return createPhilosopherMutation.mutateAsync(data);
    };

    return (
        <PhilosopherForm
            defaultValues={{
                name: '',
                birthYear: dayjs().year(),
                deathYear: dayjs().year(),
                description: '',
                terms: [],
                questions: []
            }}
            allTerms={allTerms || []}
            allQuestions={allQuestions || []}
            onSubmit={onSubmit}
        />
    );
}
