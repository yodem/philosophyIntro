import { Card, CardContent, Button, TextField, Autocomplete, Box, Typography } from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Term, Philosopher, UpdateQuestionDto, Question, BasicEntity } from '@/types';
import { EditableRichText } from '../EditableRichText';
import { EntityDisplay } from '../EntityDisplay';
import { useSnackbar } from 'notistack';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { QuestionFormInputs } from '@/types/form';
import { EntityRelation } from '@/types/form';

interface QuestionFormProps {
    defaultValues: QuestionFormInputs;
    isEdit?: boolean;
    isEditable?: boolean;
    allTerms?: Term[];
    allPhilosophers?: Philosopher[];
    onSubmit?: (data: UpdateQuestionDto) => Promise<Question | undefined>;
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
    const { t } = useTranslation();

    const { register, handleSubmit, watch, setValue, control } = useForm<QuestionFormInputs>({
        defaultValues
    });

    const { title, content } = watch();

    const relations: EntityRelation[] = [
        {
            name: 'relatedTerms' as keyof BasicEntity,
            label: t('relatedTerms'),
            options: allTerms
        },
        {
            name: 'relatedPhilosophers' as keyof BasicEntity,
            label: t('relatedPhilosophers'),
            options: allPhilosophers
        }
    ].filter(relation => relation.options.length > 0);

    if (!isEditable) {
        return (
            <EntityDisplay
                title={title}
                content={content}
                relations={[
                    {
                        title: t('relatedTerms'),
                        items: watch('relatedTerms') || [],
                        getLabel: (item: BasicEntity) => item.title,
                        getLink: (item: BasicEntity) => ({ to: "/terms/$id", params: { id: item.id.toString() } })
                    },
                    {
                        title: t('relatedPhilosophers'),
                        items: watch('relatedPhilosophers') || [],
                        getLabel: (item: BasicEntity) => item.title,
                        getLink: (item: BasicEntity) => ({ to: "/philosophers/$id", params: { id: item.id.toString() } })
                    }
                ].filter(r => r.items?.length > 0)}
            />
        );
    }

    const handleFormSubmit: SubmitHandler<QuestionFormInputs> = async (formData) => {
        try {
            if (!onSubmit) return;
            const response = await onSubmit({
                id: formData.id,
                title: formData.title,
                content: formData.content,
                relatedTerms: (formData.relatedTerms ?? []).map((t: BasicEntity) => t.id),
                relatedPhilosophers: (formData.relatedPhilosophers ?? []).map((p: BasicEntity) => p.id)
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
                            {t(isEdit ? 'editQuestion' : 'newQuestion')}
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            label={t('title')}
                            fullWidth
                            required
                            variant="standard"
                            {...register('title', { required: 'Title is required' })}
                            sx={{ mb: 3 }}
                        />
                        <Box sx={{ mb: 3 }}>
                            <EditableRichText
                                initialContent={content || ''}
                                onChange={(content) => setValue('content', content)}
                            />
                        </Box>
                        {relations.map(({ name, label, options }) => (
                            <Controller
                                key={name}
                                name={name}
                                control={control}
                                render={({ field: { onChange, value, ...props } }) => (
                                    <Autocomplete
                                        multiple
                                        options={options}
                                        getOptionLabel={(option) => option.title}
                                        value={(value ?? []) as BasicEntity[]}
                                        onChange={(_, data) => onChange(data)}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => (
                                            <TextField {...params} label={label} sx={{ mb: 2 }} />
                                        )}
                                        {...props}
                                    />
                                )}
                            />
                        ))}
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