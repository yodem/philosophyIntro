import { TextField } from '@mui/material';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormInputs } from '@/types/form';
import { LABELS } from '@/constants';

interface ImageFieldsProps {
    entityType: string;
    register: UseFormRegister<FormInputs>;
    errors: FieldErrors<FormInputs>;
    imageUrlPattern: {
        value: RegExp;
        message: string;
    };
}

export function ImageFields({ register, errors, imageUrlPattern }: ImageFieldsProps) {
    return (
        <>
            <TextField
                margin="dense"
                label="Full Picture URL"
                fullWidth
                variant="standard"
                error={!!errors.full_picture}
                helperText={errors.full_picture?.message || LABELS.IMAGE_URL_HELPER}
                {...register('full_picture', { pattern: imageUrlPattern })}
                sx={{ mb: 2 }}
            />
            <TextField
                margin="dense"
                label="Description Picture URL"
                fullWidth
                variant="standard"
                error={!!errors.description_picture}
                helperText={errors.description_picture?.message || LABELS.IMAGE_URL_HELPER}
                {...register('description_picture', { pattern: imageUrlPattern })}
                sx={{ mb: 3 }}
            />
        </>
    );
}
