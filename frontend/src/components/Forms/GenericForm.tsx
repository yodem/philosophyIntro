import { Card, CardContent, Button, TextField, Autocomplete, Box, Typography } from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { BasicEntity, EntityType } from '@/types';
import { EditableRichText } from '../EditableRichText';
import { EntityDisplay } from '../EntityDisplay';
import { useSnackbar } from 'notistack';
import { useNavigate } from '@tanstack/react-router';
import { FormInputs, RelationConfig } from '@/types/form';
import { LABELS } from '@/constants';

interface GenericFormProps {
    defaultValues: Partial<FormInputs>;
    canEdit?: boolean;
    isEditable?: boolean;
    relations?: RelationConfig[];
    onSubmit?: (data: FormInputs) => Promise<BasicEntity | undefined>;
    setIsEditable?: (isEditable: boolean) => void;
    entityType: EntityType;
    entityRoute: string;
    metadata?: Array<{ label: string; value: string }>;
}

export function GenericForm({
    defaultValues,
    canEdit = false,
    isEditable = true,
    relations = [],
    onSubmit,
    setIsEditable,
    entityType,
    entityRoute,
    metadata = []
}: GenericFormProps) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { register, handleSubmit, watch, setValue, control } = useForm<FormInputs>({
        defaultValues
    });

    const { title, content } = watch();

    const imageUrl = defaultValues?.images?.banner400x300 || defaultValues?.images?.faceImages?.face500x500;

    if (!isEditable) {
        return (
            <EntityDisplay
                title={title}
                content={content}
                metadata={metadata}
                relations={relations.map(rel => ({
                    title: rel.label,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    items: ((watch(rel.name) ?? []) as BasicEntity[]).filter((item): item is BasicEntity => item && 'id' in item && 'title' in item),
                    getLabel: (item: BasicEntity) => item.title,
                    getLink: (item: BasicEntity) => ({
                        to: `/${rel.baseRoute}/$id`,
                        params: { id: item.id.toString() }
                    })
                })).filter(r => r.items.length > 0)}
                imageUrl={imageUrl}
            />
        );
    }

    const handleFormSubmit: SubmitHandler<FormInputs> = async (formData) => {
        try {
            if (!onSubmit) return;

            const response = await onSubmit(formData);

            enqueueSnackbar(`${entityType} ${canEdit ? LABELS.UPDATED : LABELS.CREATED}!`, { variant: 'success' });

            if (canEdit && setIsEditable) {
                setIsEditable(false);
            } else if (response?.id) {
                navigate({ to: `/${entityRoute}/$id`, params: { id: response.id.toString() } });
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : LABELS.UNKNOWN_ERROR;
            enqueueSnackbar(`${LABELS.FAILED_TO_UPDATE} ${entityType}: ${message}`, { variant: 'error' });
        }
    };

    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
                        <Typography variant="h4" gutterBottom>
                            {canEdit ? `${LABELS.EDIT_ENTITY} ${entityType}` : `${LABELS.NEW_ENTITY} ${entityType}`}
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            label={LABELS.TITLE}
                            fullWidth
                            required
                            variant="standard"
                            {...register('title', { required: LABELS.TITLE_REQUIRED })}
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            margin="dense"
                            label={LABELS.DESCRIPTION}
                            fullWidth
                            required
                            variant="standard"
                            {...register('description', { required: LABELS.DESCRIPTION_REQUIRED })}
                            sx={{ mb: 3 }}
                            multiline
                            rows={3}
                        />
                        <TextField
                            margin="dense"
                            label="Image URL"
                            fullWidth
                            variant="standard"
                            {...register('images.banner400x300')}
                            sx={{ mb: 3 }}
                            helperText={LABELS.IMAGE_URL_HELPER}
                        />
                        {entityType.toLowerCase() === 'פילוסוף' && (
                            <>
                                <TextField
                                    margin="dense"
                                    label="Era"
                                    fullWidth
                                    variant="standard"
                                    {...register('era')}
                                    sx={{ mb: 3 }}
                                    helperText="לדוגמה: עתיק, ימי הביניים, מודרני, עכשווי"
                                />
                                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                    <TextField
                                        margin="dense"
                                        label="Birth Date"
                                        fullWidth
                                        variant="standard"
                                        {...register('birthDate')}
                                        helperText="לדוגמה: 470 לפנה״ס, 1724"
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Death Date"
                                        fullWidth
                                        variant="standard"
                                        {...register('deathDate')}
                                        helperText="לדוגמה: 399 לפנה״ס, 1804"
                                    />
                                </Box>
                            </>
                        )}
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
                                {canEdit ? LABELS.UPDATE : LABELS.SAVE}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}
