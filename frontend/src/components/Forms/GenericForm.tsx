import { Card, CardContent, Button, TextField, Autocomplete, Box, Typography } from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { BasicEntity } from '@/types';
import { EditableRichText } from '../EditableRichText';
import { EntityDisplay } from '../EntityDisplay';
import { useSnackbar } from 'notistack';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { FormInputs, RelationConfig } from '@/types/form';

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
    const { t } = useTranslation();

    const { register, handleSubmit, watch, setValue, control } = useForm<FormInputs>({
        defaultValues
    });

    const { title, content } = watch();

    if (!isEditable) {
        return (
            <EntityDisplay
                title={title}
                content={content}
                metadata={metadata}
                relations={relations.map(rel => ({
                    title: t(rel.label),
                    items: ((watch(rel.name) ?? []) as BasicEntity[]).filter((item): item is BasicEntity => typeof item === 'object'),
                    getLabel: (item: BasicEntity) => item.title,
                    getLink: (item: BasicEntity) => ({
                        to: `/${rel.baseRoute}/$id`,
                        params: { id: item.id.toString() }
                    })
                })).filter(r => r.items.length > 0)}
            />
        );
    }

    const handleFormSubmit: SubmitHandler<FormInputs> = async (formData) => {
        try {
            if (!onSubmit) return;

            const response = await onSubmit(formData);

            enqueueSnackbar(`${entityType} successfully ${isEdit ? 'updated' : 'created'}!`, { variant: 'success' });

            if (isEdit && setIsEditable) {
                setIsEditable(false);
            } else if (response?.id) {
                navigate({ to: `/${entityRoute}/$id`, params: { id: response.id.toString() } });
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            enqueueSnackbar(`Failed to ${isEdit ? 'update' : 'create'} ${entityType}: ${message}`, { variant: 'error' });
        }
    };

    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
                        <Typography variant="h4" gutterBottom>
                            {t(isEdit ? `edit${entityType}` : `new${entityType}`)}
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
