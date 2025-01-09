import { Card, CardContent, Button, TextField, Autocomplete, Box, Typography } from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { UpdateTermDto, Question, Philosopher, Term, BasicEntity } from '@/types';
import { EditableRichText } from '../EditableRichText';
import { EntityDisplay } from '@/components/EntityDisplay';
import { useSnackbar } from 'notistack';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { EntityRelation, TermFormInputs } from '@/types/form';

interface TermFormProps {
    defaultValues: TermFormInputs;
    isEdit?: boolean;
    isEditable?: boolean;
    allTerms?: Term[];
    allQuestions?: Question[];
    allPhilosophers?: Philosopher[];
    onSubmit?: (data: UpdateTermDto) => Promise<Term | undefined>;
    setIsEditable?: (isEditable: boolean) => void;
}

export function TermForm({
    defaultValues,
    isEdit = false,
    isEditable = true,
    allTerms = [],
    allQuestions = [],
    allPhilosophers = [],
    onSubmit,
    setIsEditable
}: TermFormProps) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { register, handleSubmit, watch, setValue, control, getValues } = useForm<TermFormInputs>({
        defaultValues
    });

    console.log('defaultValues:', defaultValues, getValues());


    const { title, content } = watch();

    const relations: EntityRelation[] = [
        {
            name: 'relatedTerms' as keyof BasicEntity,
            label: t('relatedTerms'),
            options: allTerms
        },
        {
            name: 'relatedQuestions' as keyof BasicEntity,
            label: t('relatedQuestions'),
            options: allQuestions
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
                        items: watch('relatedTerms') ?? [],
                        getLabel: (item: BasicEntity) => item.title,
                        getLink: (item: BasicEntity) => ({ to: "/terms/$id", params: { id: item.id.toString() } })
                    },
                    {
                        title: t('relatedQuestions'),
                        items: watch('relatedQuestions') ?? [],
                        getLabel: (item: BasicEntity) => item.title,
                        getLink: (item: BasicEntity) => ({ to: "/questions/$id", params: { id: item.id.toString() } })
                    },
                    {
                        title: t('relatedPhilosophers'),
                        items: watch('relatedPhilosophers') ?? [],
                        getLabel: (item: BasicEntity) => item.title,
                        getLink: (item: BasicEntity) => ({ to: "/philosophers/$id", params: { id: item.id.toString() } })
                    }
                ].filter(r => r.items?.length > 0)}
            />
        );
    }

    const handleFormSubmit: SubmitHandler<TermFormInputs> = async (formData) => {
        try {
            if (!onSubmit) return;

            const response = await onSubmit({
                ...formData,
                relatedTerms: (formData.relatedTerms ?? []).map((t: BasicEntity) => t.id),
                relatedQuestions: (formData.relatedQuestions ?? []).map((q: BasicEntity) => q.id),
                relatedPhilosophers: (formData.relatedPhilosophers ?? []).map((p: BasicEntity) => p.id)
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
                                    <Autocomplete<BasicEntity, true>
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