import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box } from '@mui/material';
import { Dayjs } from 'dayjs';

interface YearPickerProps {
    birthYear: Dayjs | null | undefined;
    deathYear: Dayjs | null | undefined;
    onBirthYearChange: (date: Dayjs | null) => void;
    onDeathYearChange: (date: Dayjs | null) => void;
}

export function YearPicker({
    birthYear,
    deathYear,
    onBirthYearChange,
    onDeathYearChange
}: YearPickerProps) {
    return (
        <Box sx={{ my: 2 }}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
                <Box>
                    <DatePicker
                        label="Birth Year"
                        views={['year']}
                        value={birthYear}
                        onChange={onBirthYearChange}
                        slotProps={{
                            textField: {
                                variant: 'standard',
                                fullWidth: true
                            }
                        }}
                    />
                </Box>
                <Box>
                    <DatePicker
                        label="Death Year"
                        views={['year']}
                        value={deathYear}
                        onChange={onDeathYearChange}
                        slotProps={{
                            textField: {
                                variant: 'standard',
                                fullWidth: true
                            }
                        }}
                    />
                </Box>
            </DemoContainer>
        </Box >
    );
}
