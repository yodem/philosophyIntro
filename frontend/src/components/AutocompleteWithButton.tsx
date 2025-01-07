import { Autocomplete, TextField, Button, Grid } from '@mui/material';
import { SyntheticEvent } from 'react';

interface AutocompleteWithButtonProps<T> {
    options: T[];
    getOptionLabel: (option: T) => string;
    value: T[];
    onChange: (event: SyntheticEvent, value: T[]) => void;
    label: string;
    onSave: () => void;
}

export function AutocompleteWithButton<T>({ options, getOptionLabel, value, onChange, label, onSave }: AutocompleteWithButtonProps<T>) {
    return (
        <Grid container spacing={2} sx={{ my: 2 }} width={"30%"}>
            <Grid item xs={10}>
                <Autocomplete
                    multiple
                    size='small'
                    options={options}
                    getOptionLabel={getOptionLabel}
                    value={value}
                    onChange={onChange}
                    renderInput={(params) => <TextField {...params} label={label} />}
                />
            </Grid>
            <Grid item xs={2}>
                <Button sx={{ height: "100%" }} variant="contained" onClick={onSave}>update</Button>
            </Grid>
        </Grid>
    );
}
