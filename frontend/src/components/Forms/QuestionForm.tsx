import { Card, CardContent, Button, TextField, Autocomplete, Box, Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Term, Philosopher, UpdateQuestionDto, Question } from '@/types';
import { EditableRichText } from '../EditableRichText';
import { EntityDisplay } from '../EntityDisplay';
import { useSnackbar } from 'notistack';
import { useNavigate } from '@tanstack/react-router';

type QuestionFormInputs = {
    question: string;
    description: string;
    terms: Term[];
    philosophers: Philosopher[];
};

interface QuestionFormProps {
    defaultValues: QuestionFormInputs;
    isEdit?: boolean;
    allTerms?: Term[];
    allPhilosophers?: Philosopher[];
    onSubmit?: (data: UpdateQuestionDto) => Promise<Question | undefined>;
    isEditable?: boolean;
    setIsEditable?: (isEditable: boolean) => void;
}

export function QuestionForm({
    defaultValues,
    isEdit = false,
    isEditable = true,
    allTerms = [],
    allPhilosophers = [],
    onSubmit,
    setIsEditable
}: QuestionFormProps) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { register, handleSubmit, watch, setValue } = useForm<QuestionFormInputs>({
        defaultValues
    });

    if (!isEditable) {
        return (
            <EntityDisplay
                title={defaultValues.question}
                content={defaultValues.description}
                relations={[
                    {
                        title: "Related Terms",
                        items: defaultValues.terms,
                        getLabel: (item) => item.term,
                        getLink: (item) => ({ to: "/terms/$id", params: { id: item.id.toString() } })
                    },
                    {
                        title: "Discussed by",
                        items: defaultValues.philosophers,
                        getLabel: (item) => item.name,
                        getLink: (item) => ({ to: "/philosophers/$id", params: { id: item.id.toString() } })
                    }
                ]}
            />
        );
    }

    const handleFormSubmit: SubmitHandler<QuestionFormInputs> = async (formData) => {
        try {
            if (!onSubmit) return;
            const response = await onSubmit({
                ...formData,
                terms: formData.terms.map(t => t.id),
                philosophers: formData.philosophers.map(p => p.id)
            });

            enqueueSnackbar(`Question successfully ${isEdit ? 'updated' : 'created'}!`, { variant: 'success' });

            if (isEdit && setIsEditable) {
                setIsEditable(false);
            } else if (response?.id) {
                navigate({ to: '/questions/$id', params: { id: response.id.toString() } });
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            enqueueSnackbar(`Failed to ${isEdit ? 'update' : 'create'} question: ${message}`, { variant: 'error' });
        }
    };

    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
                        <Typography variant="h4" gutterBottom>
                            {isEdit ? 'Update Question' : 'Add New Question'}
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Question"
                            fullWidth
                            required
                            variant="standard"
                            {...register('question', { required: 'Question is required' })}
                            sx={{ mb: 3 }}
                        />
                        <Box sx={{ mb: 3 }}>
                            <EditableRichText
                                initialContent={watch('description') || ''}
                                onChange={(content) => setValue('description', content)}
                            />
                        </Box>
                        <Autocomplete<Term, true>
                            multiple
                            options={allTerms}
                            getOptionLabel={(option: Term) => option.term}
                            value={watch('terms') ?? []}
                            onChange={(_, value) => setValue('terms', value)}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => (
                                <TextField {...params} label="Related Terms" sx={{ mb: 2 }} />
                            )}
                        />
                        <Autocomplete<Philosopher, true>
                            multiple
                            options={allPhilosophers}
                            getOptionLabel={(option: Philosopher) => option.name}
                            value={watch('philosophers') ?? []}
                            onChange={(_, value) => setValue('philosophers', value)}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => (
                                <TextField {...params} label="Discussed by" sx={{ mb: 3 }} />
                            )}
                        />
                        <Box sx={{ mt: 3 }}>
                            <Button
                                variant="contained"
                                type="submit"
                                size="large"
                                fullWidth
                            >
                                {isEdit ? 'Update' : 'Save'}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}