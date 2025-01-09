import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { philosophersApi, termsApi, questionsApi } from '../../api';
import { UpdatePhilosopherDto } from '@/types';
import { GenericForm } from '../../components/Forms/GenericForm';
import { useTranslation } from 'react-i18next';
import { FormInputs } from '@/types/form';

export const Route = createFileRoute('/philosophers/new')({
    component: NewPhilosopherComponent,
});

function NewPhilosopherComponent() {
    const { t } = useTranslation();
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
            birthdate: data.birthdate || '',
            deathdate: data.deathdate || '',
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
                era: '',
                birthdate: '',
                deathdate: '',
                relatedTerms: [],
                relatedQuestions: [],
                relatedPhilosophers: []
            }}
            entityType="Philosopher"
            entityRoute="philosophers"
            relations={[
                {
                    name: 'relatedTerms',
                    label: t('relatedTerms'),
                    options: allTerms || [],
                    baseRoute: 'terms'
                },
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
                }
            ]}
            renderAdditionalFields={(register) => (
                <>
                    <TextField
                        margin="dense"
                        label={t('era')}
                        fullWidth
                        required
                        variant="standard"
                        {...register('era', { required: 'Era is required' })}
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        margin="dense"
                        label={t('birthdate')}
                        fullWidth
                        variant="standard"
                        {...register('birthdate')}
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        margin="dense"
                        label={t('deathdate')}
                        fullWidth
                        variant="standard"
                        {...register('deathdate')}
                        sx={{ mb: 3 }}
                    />
                </>
            )}
            onSubmit={onSubmit}
        />
    );
}
