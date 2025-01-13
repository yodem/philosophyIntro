import { Autocomplete, TextField, Button, Grid } from '@mui/material';
import { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface AutocompleteWithButtonProps<T> {
    options: T[];
    getOptionLabel: (option: T) => string;
    value: T[];
    onChange: (event: SyntheticEvent, value: T[]) => void;
    label: string;
    onSave: () => void;
}

export function AutocompleteWithButton<T>({ options, getOptionLabel, value, onChange, label, onSave }: AutocompleteWithButtonProps<T>) {
    const { t } = useTranslation();

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
                    renderInput={(params) => <TextField {...params} label={t(label)} />}
                />
            </Grid>
            <Grid item xs={2}>
                <Button sx={{ height: "100%" }} variant="contained" onClick={onSave}>{t('update')}</Button>
            </Grid>
        </Grid>
    );
}
