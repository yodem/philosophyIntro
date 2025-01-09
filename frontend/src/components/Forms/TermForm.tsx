import { Card, CardContent, Button, TextField, Autocomplete, Box, Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TermFormInputs, UpdateTermDto, Question, Philosopher, Term } from '@/types';
import { EditableRichText } from '../EditableRichText';
import { EntityDisplay } from '@/components/EntityDisplay';
import { useSnackbar } from 'notistack';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

interface TermFormProps {
    defaultValues: TermFormInputs;
    isEdit?: boolean;
    isEditable?: boolean;
    allQuestions?: Question[];
    allPhilosophers?: Philosopher[];
    onSubmit?: (data: UpdateTermDto) => Promise<Term | undefined>;
    setIsEditable?: (isEditable: boolean) => void;
}

export function TermForm({
    defaultValues,
    isEdit = false,
    isEditable = true,
    allQuestions = [],
    allPhilosophers = [],
    onSubmit,
    setIsEditable
}: TermFormProps) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { register, handleSubmit, watch, setValue } = useForm<TermFormInputs>({
        defaultValues
    });

    if (!isEditable) {
        return (
            <EntityDisplay
                title={defaultValues.term}
                content={defaultValues.definition}
                relations={[
                    {
                        title: "Key Philosophers",
                        items: defaultValues.philosophers,
                        getLabel: (item) => item.name,
                        getLink: (item) => ({ to: "/philosophers/$id", params: { id: item.id.toString() } })
                    },
                    {
                        title: "Related Questions",
                        items: defaultValues.questions,
                        getLabel: (item) => item.question,
                        getLink: (item) => ({ to: "/questions/$id", params: { id: item.id.toString() } })
                    }
                ]}
            />
        );
    }

    const handleFormSubmit: SubmitHandler<TermFormInputs> = async (formData) => {
        try {
            if (!onSubmit) return;

            const response = await onSubmit({
                ...formData,
                questions: formData.questions.map(q => q.id),
                philosophers: formData.philosophers.map(p => p.id),
            });

            enqueueSnackbar(`Term successfully ${isEdit ? 'updated' : 'created'}!`, { variant: 'success' });

            if (isEdit && setIsEditable) {
                setIsEditable(false);
            } else if (response?.id) {
                navigate({ to: '/terms/$id', params: { id: response.id.toString() } });
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            enqueueSnackbar(`Failed to ${isEdit ? 'update' : 'create'} term: ${message}`, { variant: 'error' });
        }
    };

    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
                        <Typography variant="h4" gutterBottom>
                            {t(isEdit ? 'editTerm' : 'newTerm')}
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            label={t('term')}
                            fullWidth
                            required
                            variant="standard"
                            {...register('term', { required: 'Term is required' })}
                            sx={{ mb: 3 }}
                        />
                        <Box sx={{ mb: 3 }}>
                            <EditableRichText
                                initialContent={watch('definition') || ''}
                                onChange={(content) => setValue('definition', content)}
                            />
                        </Box>
                        <Autocomplete<Question, true>
                            multiple
                            options={allQuestions}
                            getOptionLabel={(option: Question) => option.question}
                            value={watch('questions') ?? []}
                            onChange={(_, value) => setValue('questions', value)}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => (
                                <TextField {...params} label={t('relatedQuestions')} sx={{ mb: 2 }} />
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
                                <TextField {...params} label={t('keyPhilosophers')} sx={{ mb: 3 }} />
                            )}
                        />
                        <Box sx={{ mt: 3 }}>
                            <Button
                                variant="contained"
                                type="submit"
                                size="large"
                                fullWidth
                            >
                                {t(isEdit ? 'update' : 'save')}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}