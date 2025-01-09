import { Card, CardContent, TextField, Button, Autocomplete, Box, Typography } from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Term, Question, UpdatePhilosopherDto, Philosopher, BasicEntity } from '@/types';
import { PhilosopherFormInputs, EntityRelation } from '@/types/form';
import { EditableRichText } from '../EditableRichText';
import { EntityDisplay } from '../EntityDisplay';
import { useSnackbar } from 'notistack';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

interface PhilosopherFormProps {
    defaultValues: PhilosopherFormInputs;
    isEdit?: boolean;
    allTerms?: Term[];
    allQuestions?: Question[];
    onSubmit?: (data: UpdatePhilosopherDto) => Promise<Philosopher | undefined>;
    isEditable?: boolean;
    setIsEditable?: (isEditable: boolean) => void;
    allPhilosophers?: Philosopher[];  // Add this prop
}

export function PhilosopherForm({
    defaultValues,
    isEdit = false,
    isEditable = true,
    allTerms = [],
    allQuestions = [],
    allPhilosophers = [], // Add this prop
    onSubmit,
    setIsEditable
}: PhilosopherFormProps) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { t } = useTranslation();

    console.log({ defaultValues });

    const { register, handleSubmit, watch, setValue, control } = useForm<PhilosopherFormInputs>({
        defaultValues,
        mode: "onChange"
    });

    const { title, content, era, birthdate, deathdate, relatedTerms, relatedQuestions, relatedPhilosophers, id } = watch();

    console.log("values:", { title, content, era, birthdate, deathdate, relatedTerms, relatedQuestions, relatedPhilosophers, id });

    if (!isEditable) {

        return (
            <EntityDisplay
                key={id}
                title={title}
                content={content}
                metadata={[
                    { label: "Era", value: era },
                    { label: "Birth Date", value: birthdate || 'Unknown' },
                    { label: "Death Date", value: deathdate || 'Unknown' }
                ]}
                relations={[
                    {
                        title: t('relatedTerms'),
                        items: relatedTerms,
                        getLabel: (item: BasicEntity) => item.title,
                        getLink: (item: BasicEntity) => ({ to: "/terms/$id", params: { id: item.id.toString() } })
                    },
                    {
                        title: t('relatedQuestions'),
                        items: relatedQuestions,
                        getLabel: (item: BasicEntity) => item.title,
                        getLink: (item: BasicEntity) => ({ to: "/questions/$id", params: { id: item.id.toString() } })
                    },
                    {
                        title: t('relatedPhilosophers'),
                        items: relatedPhilosophers,
                        getLabel: (item: BasicEntity) => item.title,
                        getLink: (item: BasicEntity) => ({ to: "/philosophers/$id", params: { id: item.id.toString() } })
                    }
                ].filter(r => r.items?.length > 0)}
            />
        );
    }

    const relations: EntityRelation[] = [
        {
            name: 'relatedTerms',
            label: t('relatedTerms'),
            options: allTerms
        },
        {
            name: 'relatedQuestions',
            label: t('relatedQuestions'),
            options: allQuestions
        },
        {
            name: 'relatedPhilosophers',
            label: t('relatedPhilosophers'),
            options: allPhilosophers
        }
    ].filter(relation => relation.options.length > 0);

    const handleFormSubmit: SubmitHandler<PhilosopherFormInputs> = async (formData) => {
        try {
            if (!onSubmit) return;
            const response = await onSubmit({
                id: formData.id,
                title: formData.title,
                content: formData.content,
                era: formData.era,
                birthdate: formData.birthdate,
                deathdate: formData.deathdate,
                relatedTerms: formData.relatedTerms.map(t => t.id),
                relatedQuestions: formData.relatedQuestions.map(q => q.id),
                relatedPhilosophers: formData.relatedPhilosophers.map(p => p.id)
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
                    <form key={defaultValues.id} onSubmit={handleSubmit(handleFormSubmit)} noValidate>
                        <Typography variant="h4" gutterBottom>
                            {t(isEdit ? 'updatePhilosopher' : 'addPhilosopher')}
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            label={t('title')}  // Changed from 'name'
                            fullWidth
                            required
                            variant="standard"
                            {...register('title', { required: 'Title is required' })}  // Changed from 'name'
                            sx={{ mb: 3 }}
                        />
                        <Box sx={{ mb: 3 }}>
                            <EditableRichText
                                key={`content-${defaultValues.id}`}
                                initialContent={content || ''}  // Changed from 'description'
                                onChange={(content) => setValue('content', content)}  // Changed from 'description'
                            />
                        </Box>
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
                        {relations.map(({ name, label, options }) => (
                            <Controller
                                key={name}
                                name={name}
                                control={control}
                                defaultValue={[]}
                                render={({ field: { onChange, value, ...props } }) => (
                                    <Autocomplete<BasicEntity, true>
                                        multiple
                                        options={options}
                                        getOptionLabel={(option) => option.title}
                                        value={value ?? []}
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