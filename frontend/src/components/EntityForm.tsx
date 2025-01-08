import { Card, CardContent, Box, Typography, Button, TextField, Autocomplete } from '@mui/material';
import { EditableRichText } from './EditableRichText';
import { YearPicker } from './YearPicker';
import { Dayjs } from 'dayjs';

interface EntityFormProps {
    title: string;
    initialData: any;
    onSave: (data: any) => void;
    config: {
        mainField: {
            label: string;
            key: string;
        };
        description?: boolean;
        dateRange?: boolean;
        relations?: Array<{
            label: string;
            key: string;
            options: any[];
            getOptionLabel: (option: any) => string;
        }>;
    };
}

export function EntityForm({ title, initialData, onSave, config }: EntityFormProps) {
    const [formData, setFormData] = useState(initialData);
    const [relatedItems, setRelatedItems] = useState<Record<string, any[]>>({});

    const handleChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleRelationChange = (key: string, value: any[]) => {
        setRelatedItems(prev => ({ ...prev, [key]: value }));
    };

    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>{title}</Typography>

                    <TextField
                        autoFocus
                        margin="dense"
                        label={config.mainField.label}
                        fullWidth
                        variant="standard"
                        value={formData[config.mainField.key]}
                        onChange={(e) => handleChange(config.mainField.key, e.target.value)}
                    />

                    {config.dateRange && (
                        <YearPicker
                            birthYear={formData.birthYear}
                            deathYear={formData.deathYear}
                            onBirthYearChange={(date: Dayjs | null) => handleChange('birthYear', date)}
                            onDeathYearChange={(date: Dayjs | null) => handleChange('deathYear', date)}
                        />
                    )}

                    {config.description && (
                        <EditableRichText
                            initialContent={formData.description}
                            onChange={(content) => handleChange('description', content)}
                        />
                    )}

                    {config.relations?.map(relation => (
                        <Autocomplete
                            key={relation.key}
                            multiple
                            options={relation.options}
                            getOptionLabel={relation.getOptionLabel}
                            value={relatedItems[relation.key] || []}
                            onChange={(_, value) => handleRelationChange(relation.key, value)}
                            renderInput={(params) => <TextField {...params} label={relation.label} />}
                        />
                    ))}

                    <Button variant="contained" onClick={() => onSave({ ...formData, ...relatedItems })}>
                        Save
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}
