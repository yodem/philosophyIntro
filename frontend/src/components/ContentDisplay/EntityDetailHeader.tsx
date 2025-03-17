import { Box, Typography, Button, Divider } from '@mui/material';
import { Edit } from 'lucide-react';

interface EntityDetailHeaderProps {
    title: string;
    setIsEditable: (editable: boolean) => void;
}

export function EntityDetailHeader({ title, setIsEditable }: EntityDetailHeaderProps) {
    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h4" component="h1">
                    {title}
                </Typography>
                <Button
                    variant="text"
                    startIcon={<Edit size={16} />}
                    onClick={() => setIsEditable(true)}
                    size='large'
                >
                    עריכה
                </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
        </Box>
    );
}
