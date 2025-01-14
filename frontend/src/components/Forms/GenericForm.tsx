import { Card, CardContent, Button, TextField, Autocomplete, Box, Typography } from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { BasicEntity } from '@/types';
import { EditableRichText } from '../EditableRichText';
import { EntityDisplay } from '../EntityDisplay';
import { useSnackbar } from 'notistack';
import { useNavigate } from '@tanstack/react-router';
import { FormInputs, RelationConfig } from '@/types/form';
import { LABELS } from '@/constants';

interface GenericFormProps {
    defaultValues: Partial<FormInputs>;
    isEdit?: boolean;
    isEditable?: boolean;
    relations?: RelationConfig[];
    onSubmit?: (data: FormInputs) => Promise<BasicEntity | undefined>;
    setIsEditable?: (isEditable: boolean) => void;
    entityType: string;
    entityRoute: string;
    metadata?: Array<{ label: string; value: string }>;
}

export function GenericForm({
    defaultValues,
    isEdit = false,
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

    console.log(watch());

    const { title, content } = watch();

    const imageUrl = defaultValues?.images?.banner800x600 || defaultValues?.images?.faceImages?.face500x500;

    if (!isEditable) {
        return (
            <EntityDisplay
                title={title}
                content={content}
                metadata={metadata}
                relations={relations.map(rel => ({
                    title: rel.label,
                    items: ((watch(rel.name) ?? []) as BasicEntity[]).filter((item): item is BasicEntity => typeof item === 'object'),
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

            enqueueSnackbar(`${entityType} ${isEdit ? LABELS.UPDATED : LABELS.CREATED}!`, { variant: 'success' });

            if (isEdit && setIsEditable) {
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
                            {isEdit ? `${LABELS.EDIT_ENTITY} ${entityType}` : `${LABELS.NEW_ENTITY} ${entityType}`}
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
                                {isEdit ? LABELS.UPDATE : LABELS.SAVE}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}
