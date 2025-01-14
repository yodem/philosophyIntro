import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { philosophersApi, termsApi, questionsApi } from '../../api';
import { UpdatePhilosopherDto } from '@/types';
import { GenericForm } from '../../components/Forms/GenericForm';
import { FormInputs } from '@/types/form';
import { LABELS } from '@/constants';

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

    const { data: allPhilosophers } = useQuery({
        queryKey: ['philosophers'],
        queryFn: philosophersApi.getAll
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

    const onSubmit = async (data: FormInputs) => {
        return createPhilosopherMutation.mutateAsync({
            ...data,
            era: data.era || '',
            birthDate: data.birthDate || '',
            deathDate: data.deathDate || '',
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
                era: '',
                birthDate: '',
                deathDate: '',
                associatedTerms: [],
                associatedQuestions: [],
                associatedPhilosophers: []
            }}
            entityType="Philosopher"
            entityRoute="philosophers"
            relations={[
                {
                    name: 'associatedTerms',
                    label: LABELS.RELATED_TERMS,
                    options: allTerms || [],
                    baseRoute: 'terms'
                },
                {
                    name: 'associatedQuestions',
                    label: LABELS.RELATED_QUESTIONS,
                    options: allQuestions || [],
                    baseRoute: 'questions'
                },
                {
                    name: 'associatedPhilosophers',
                    label: LABELS.RELATED_PHILOSOPHERS,
                    options: allPhilosophers || [],
                    baseRoute: 'philosophers'
                }
            ]}
            // renderAdditionalFields={(register) => (
            //     <>
            //         <TextField
            //             margin="dense"
            //             label={LABELS.ERA}
            //             fullWidth
            //             required
            //             variant="standard"
            //             {...register('era', { required: LABELS.ERA })}
            //             sx={{ mb: 3 }}
            //         />
            //         <TextField
            //             margin="dense"
            //             label={LABELS.BIRTH_DATE}
            //             fullWidth
            //             variant="standard"
            //             {...register('birthDate')}
            //             sx={{ mb: 3 }}
            //         />
            //         <TextField
            //             margin="dense"
            //             label={LABELS.DEATH_DATE}
            //             fullWidth
            //             variant="standard"
            //             {...register('deathDate')}
            //             sx={{ mb: 3 }}
            //         />
            //     </>)}

            onSubmit={onSubmit}
        />
    );
}
