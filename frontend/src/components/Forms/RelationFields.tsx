import { Control, Controller } from "react-hook-form";
import { Autocomplete, Box, Chip, TextField, Typography } from "@mui/material";
import { FormInputs, RelationConfig } from "@/types/form";

interface RelationFieldsProps {
    relations: RelationConfig[];
    control: Control<FormInputs>;
}

export function RelationFields({ relations, control }: RelationFieldsProps) {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>קשרים</Typography>
            {relations.map((relation) => (
                <Controller
                    key={relation.name}
                    name={relation.name}
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            multiple
                            id={`${relation.name}-select`}
                            options={relation.options.filter(option => !field.value || !Array.isArray(field.value) || !field.value.some(val => val.id === option.id))}
                            getOptionLabel={(option) => option.title}
                            value={Array.isArray(field.value) ? field.value : []}
                            onChange={(_, newValue) => field.onChange(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" label={relation.label} fullWidth sx={{ mb: 2 }} />
                            )}
                            renderTags={(tagValue, getTagProps) =>
                                tagValue.map((option, index) => (
                                    <Chip label={option.title} {...getTagProps({ index })} key={option.id} />
                                ))
                            }
                        />
                    )}
                />
            ))}
        </Box>
    );
}
