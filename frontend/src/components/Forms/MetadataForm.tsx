import { useState, useEffect } from 'react';
import { Box, TextField, Typography, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ContentTypes } from '@/types';
import { useFormContext, Controller, FieldValues } from 'react-hook-form';

export interface MetadataDefinition {
    key: string;
    displayName: string;
    dataType: 'string' | 'number' | 'date' | 'text';
    isRequired: boolean;
}

interface MetadataFormProps {
    contentType: ContentTypes;
    metadata: Record<string, unknown>;
    onChange?: (metadata: Record<string, unknown>) => void;
    isEditable?: boolean;
    metadataSchema?: MetadataDefinition[];
}

export function MetadataForm({
    contentType,
    metadata,
    onChange,
    isEditable = true,
    metadataSchema
}: MetadataFormProps) {
    const [schema, setSchema] = useState<MetadataDefinition[]>([]);
    const [loading, setLoading] = useState(!metadataSchema);
    const [error, setError] = useState<string | null>(null);

    // Try to use form context if available (in edit mode)
    const formContext = useFormContext();
    const isInsideFormContext = formContext && isEditable;

    useEffect(() => {
        // If schema is provided directly, use it immediately
        if (metadataSchema) {
            setSchema(metadataSchema);
            setLoading(false);
            return;
        }

        // Otherwise, infer schema from the metadata object or use fallback
        if (metadata && Object.keys(metadata).length > 0) {
            const inferredSchema = inferSchemaFromMetadata(metadata);
            setSchema(inferredSchema);
            setLoading(false);
            return;
        }

        // If no metadata, use fallback schema
        const fallbackSchema = getFallbackSchema(contentType);
        setSchema(fallbackSchema);
        setLoading(false);
    }, [contentType, metadata, metadataSchema]);

    // Handle metadata changes when not using form context
    const handleFieldChange = (key: string, value: unknown) => {
        if (onChange) {
            onChange({
                ...metadata,
                [key]: value
            });
        }
    };

    if (loading) {
        return <Typography>Loading metadata fields...</Typography>;
    }

    // When using in read-only mode or without form context
    if (!isInsideFormContext) {
        return (
            <Box>
                {error && <Typography color="error">{error}</Typography>}
                <RenderMetadataFieldsStandalone
                    schema={schema}
                    metadata={metadata}
                    onChange={handleFieldChange}
                    isEditable={isEditable}
                />
            </Box>
        );
    }

    // When inside a form context (react-hook-form)
    return (
        <Box>
            {error && <Typography color="error">{error}</Typography>}
            <RenderMetadataFieldsWithFormContext
                schema={schema}
                isEditable={isEditable}
            />
        </Box>
    );
}

// Helper function to infer schema from metadata
function inferSchemaFromMetadata(metadata: Record<string, unknown>): MetadataDefinition[] {
    return Object.entries(metadata).map(([key, value]) => {
        // Determine data type based on value
        let dataType: 'string' | 'number' | 'date' | 'text' = 'string';

        if (typeof value === 'number') {
            dataType = 'number';
        } else if (typeof value === 'string') {
            // Check if it looks like a date
            const datePattern = /^\d{4}-\d{2}-\d{2}|^\d{4}\/\d{2}\/\d{2}/;
            if (datePattern.test(value)) {
                dataType = 'date';
            } else if (value.length > 100) {
                dataType = 'text'; // Long strings as multiline text
            }
        }

        return {
            key,
            displayName: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
            dataType,
            isRequired: false
        };
    });
}

// React Hook Form version of the fields renderer
function RenderMetadataFieldsWithFormContext({
    schema,
    isEditable
}: {
    schema: MetadataDefinition[];
    isEditable: boolean;
}) {
    const { control, formState: { errors } } = useFormContext<FieldValues>();

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
                {schema.map((field) => {
                    // Read-only view (should not happen in this component, but just in case)
                    if (!isEditable) {
                        return (
                            <Grid item xs={12} sm={6} key={field.key}>
                                <Typography variant="subtitle2" component="div" sx={{ color: 'text.secondary' }}>
                                    {field.displayName}:
                                </Typography>
                                <Controller
                                    name={`metadata.${field.key}`}
                                    control={control}
                                    render={({ field: formField }) => (
                                        <Typography variant="body1">
                                            {field.dataType === 'date' ? formatDate(formField.value) : formField.value || '-'}
                                        </Typography>
                                    )}
                                />
                            </Grid>
                        );
                    }

                    // Editable fields using react-hook-form
                    switch (field.dataType) {
                        case 'date':
                            return (
                                <Grid item xs={12} sm={6} key={field.key}>
                                    <Controller
                                        name={`metadata.${field.key}`}
                                        control={control}
                                        rules={{ required: field.isRequired }}
                                        render={({ field: formField }) => (
                                            <DatePicker
                                                label={field.displayName}
                                                value={formField.value ? new Date(formField.value) : null}
                                                onChange={(date) => formField.onChange(date ? date.toISOString().split('T')[0] : null)}
                                                slotProps={{
                                                    textField: {
                                                        variant: 'outlined',
                                                        fullWidth: true,
                                                        required: field.isRequired,
                                                        error: !!errors?.metadata?.[field.key as keyof typeof errors.metadata],
                                                        helperText: errors?.metadata?.[field.key as keyof typeof errors.metadata]?.message,
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            );

                        case 'number':
                            return (
                                <Grid item xs={12} sm={6} key={field.key}>
                                    <Controller
                                        name={`metadata.${field.key}`}
                                        control={control}
                                        rules={{ required: field.isRequired }}
                                        render={({ field: formField }) => (
                                            <TextField
                                                fullWidth
                                                label={field.displayName}
                                                type="number"
                                                required={field.isRequired}
                                                error={!!errors?.metadata?.[field.key as keyof typeof errors.metadata]}
                                                helperText={errors?.metadata?.[field.key as keyof typeof errors.metadata]?.message}
                                                value={formField.value || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    formField.onChange(value ? Number(value) : '');
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            );

                        case 'text':
                            return (
                                <Grid item xs={12} key={field.key}>
                                    <Controller
                                        name={`metadata.${field.key}`}
                                        control={control}
                                        rules={{ required: field.isRequired }}
                                        render={({ field: formField }) => (
                                            <TextField
                                                fullWidth
                                                label={field.displayName}
                                                multiline
                                                rows={4}
                                                required={field.isRequired}
                                                error={!!errors?.metadata?.[field.key as keyof typeof errors.metadata]}
                                                helperText={errors?.metadata?.[field.key as keyof typeof errors.metadata]?.message}
                                                {...formField}
                                            />
                                        )}
                                    />
                                </Grid>
                            );

                        default:
                            return (
                                <Grid item xs={12} sm={6} key={field.key}>
                                    <Controller
                                        name={`metadata.${field.key}`}
                                        control={control}
                                        rules={{ required: field.isRequired }}
                                        render={({ field: formField }) => (
                                            <TextField
                                                fullWidth
                                                label={field.displayName}
                                                required={field.isRequired}
                                                error={!!errors?.metadata?.[field.key as keyof typeof errors.metadata]}
                                                helperText={errors?.metadata?.[field.key as keyof typeof errors.metadata]?.message}
                                                {...formField}
                                            />
                                        )}
                                    />
                                </Grid>
                            );
                    }
                })}
            </Grid>
        </LocalizationProvider>
    );
}

// Original standalone fields renderer for backwards compatibility 
// (used in read-only mode or when not in a form context)
function RenderMetadataFieldsStandalone({
    schema,
    metadata,
    onChange,
    isEditable
}: {
    schema: MetadataDefinition[];
    metadata: Record<string, unknown>;
    onChange: (key: string, value: unknown) => void;
    isEditable: boolean;
}) {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
                {schema.map((field) => {
                    const value = metadata[field.key] !== undefined ? metadata[field.key] : '';

                    if (!isEditable) {
                        // Read-only display
                        return (
                            <Grid item xs={12} sm={6} key={field.key}>
                                <Typography variant="subtitle2" component="div" sx={{ color: 'text.secondary' }}>
                                    {field.displayName}:
                                </Typography>
                                <Typography variant="body1">
                                    {field.dataType === 'date' ? formatDate(value) : value || '-'}
                                </Typography>
                            </Grid>
                        );
                    }

                    // Editable fields based on data type
                    switch (field.dataType) {
                        case 'date':
                            return (
                                <Grid item xs={12} sm={6} key={field.key}>
                                    <DatePicker
                                        label={field.displayName}
                                        value={value ? new Date(value) : null}
                                        onChange={(date) => onChange(field.key, date ? date.toISOString().split('T')[0] : null)}
                                        slotProps={{
                                            textField: {
                                                variant: 'outlined',
                                                fullWidth: true,
                                                required: field.isRequired,
                                            },
                                        }}
                                    />
                                </Grid>
                            );

                        case 'number':
                            return (
                                <Grid item xs={12} sm={6} key={field.key}>
                                    <TextField
                                        fullWidth
                                        label={field.displayName}
                                        type="number"
                                        value={value}
                                        onChange={(e) => onChange(field.key, e.target.value ? Number(e.target.value) : '')}
                                        required={field.isRequired}
                                    />
                                </Grid>
                            );

                        case 'text':
                            return (
                                <Grid item xs={12} key={field.key}>
                                    <TextField
                                        fullWidth
                                        label={field.displayName}
                                        multiline
                                        rows={4}
                                        value={value}
                                        onChange={(e) => onChange(field.key, e.target.value)}
                                        required={field.isRequired}
                                    />
                                </Grid>
                            );

                        default:
                            return (
                                <Grid item xs={12} sm={6} key={field.key}>
                                    <TextField
                                        fullWidth
                                        label={field.displayName}
                                        value={value}
                                        onChange={(e) => onChange(field.key, e.target.value)}
                                        required={field.isRequired}
                                    />
                                </Grid>
                            );
                    }
                })}
            </Grid>
        </LocalizationProvider>
    );
}

// Helper function to format dates for display
function formatDate(dateString: unknown): string {
    if (!dateString) return '-';

    try {
        const date = new Date(String(dateString));
        return date.toLocaleDateString();
    } catch {
        return String(dateString);
    }
}

// Fallback schemas if API fails
function getFallbackSchema(contentType: ContentTypes): MetadataDefinition[] {
    switch (contentType) {
        case ContentTypes.PHILOSOPHER:
            return [
                {
                    key: 'birthDate',
                    displayName: 'Birth Date',
                    dataType: 'date',
                    isRequired: false,
                },
                {
                    key: 'deathDate',
                    displayName: 'Death Date',
                    dataType: 'date',
                    isRequired: false,
                },
                {
                    key: 'era',
                    displayName: 'Era',
                    dataType: 'string',
                    isRequired: false,
                },
            ];

        case ContentTypes.QUESTION:
            return [
                {
                    key: 'category',
                    displayName: 'Category',
                    dataType: 'string',
                    isRequired: false,
                },
            ];

        case ContentTypes.TERM:
            return [
                {
                    key: 'origin',
                    displayName: 'Origin',
                    dataType: 'string',
                    isRequired: false,
                },
            ];

        default:
            return [];
    }
}
