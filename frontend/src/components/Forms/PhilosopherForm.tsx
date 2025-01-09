import { Card, CardContent, TextField, Button, Autocomplete, Box, Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Term, Question, UpdatePhilosopherDto, Philosopher } from '@/types';
import dayjs from 'dayjs';
import { EditableRichText } from '../EditableRichText';
import { YearPicker } from '../YearPicker';
import { EntityDisplay } from '../EntityDisplay';
import { useSnackbar } from 'notistack';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

type PhilosopherFormInputs = {
    name: string;
    birthYear: number;
    deathYear: number;
    description: string;
    terms: Term[];
    questions: Question[];
};

interface PhilosopherFormProps {
    defaultValues: PhilosopherFormInputs;
    isEdit?: boolean;
    allTerms?: Term[];
    allQuestions?: Question[];
    onSubmit?: (data: UpdatePhilosopherDto) => Promise<Philosopher | undefined>;
    isEditable?: boolean;
    setIsEditable?: (isEditable: boolean) => void;
}

export function PhilosopherForm({
    defaultValues,
    isEdit = false,
    isEditable = true,
    allTerms = [],
    allQuestions = [],
    onSubmit,
    setIsEditable
}: PhilosopherFormProps) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { register, handleSubmit, watch, setValue } = useForm<PhilosopherFormInputs>({
        defaultValues
    });

    if (!isEditable) {
        return (
            <EntityDisplay
                title={defaultValues.name}
                content={defaultValues.description}
                metadata={[
                    { label: "Birth Year", value: defaultValues.birthYear?.toString() || 'Unknown' },
                    { label: "Death Year", value: defaultValues.deathYear?.toString() || 'Unknown' }
                ]}
                relations={[
                    {
                        title: "Key Terms",
                        items: defaultValues.terms,
                        getLabel: (item) => item.term,
                        getLink: (item) => ({ to: "/terms/$id", params: { id: item.id.toString() } })
                    },
                    {
                        title: "Key Questions",
                        items: defaultValues.questions,
                        getLabel: (item) => item.question,
                        getLink: (item) => ({ to: "/questions/$id", params: { id: item.id.toString() } })
                    }
                ]}
            />
        );
    }

    const handleFormSubmit: SubmitHandler<PhilosopherFormInputs> = async (formData) => {
        try {
            if (!onSubmit) return;
            const response = await onSubmit({
                ...formData,
                birthYear: formData.birthYear,
                deathYear: formData.deathYear,
                terms: formData.terms.map(t => t.id),
                questions: formData.questions.map(q => q.id)
            });

            enqueueSnackbar(t(isEdit ? 'philosopherUpdated' : 'philosopherCreated'), { variant: 'success' });

            if (isEdit && setIsEditable) {
                setIsEditable(false);
            } else if (response?.id) {
                navigate({ to: '/philosophers/$id', params: { id: response.id.toString() } });
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            enqueueSnackbar(`Failed to ${isEdit ? 'update' : 'create'} philosopher: ${message}`, { variant: 'error' });
        }
    };

    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
                        <Typography variant="h4" gutterBottom>
                            {t(isEdit ? 'updatePhilosopher' : 'addPhilosopher')}
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            label={t('name')}
                            fullWidth
                            required
                            variant="standard"
                            {...register('name', { required: 'Name is required' })}
                            sx={{ mb: 3 }}
                        />
                        <Box sx={{ mb: 3 }}>
                            <YearPicker
                                birthYear={watch('birthYear') ? dayjs().year(watch('birthYear')) : undefined}
                                deathYear={watch('deathYear') ? dayjs().year(watch('deathYear')) : undefined}
                                onBirthYearChange={(date) => {
                                    const year = date?.isValid() ? date.year() : undefined;
                                    setValue('birthYear', year ?? 0);
                                }}
                                onDeathYearChange={(date) => {
                                    const year = date?.isValid() ? date.year() : undefined;
                                    setValue('deathYear', year ?? 0);
                                }}
                            />
                        </Box>
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
                                <TextField {...params} label={t('keyTerms')} sx={{ mb: 2 }} />
                            )}
                        />
                        <Autocomplete<Question, true>
                            multiple
                            options={allQuestions}
                            getOptionLabel={(option: Question) => option.question}
                            value={watch('questions') ?? []}
                            onChange={(_, value) => setValue('questions', value)}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => (
                                <TextField {...params} label={t('keyQuestions')} sx={{ mb: 3 }} />
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