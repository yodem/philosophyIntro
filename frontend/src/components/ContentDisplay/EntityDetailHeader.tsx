import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface EntityDetailHeaderProps {
    title: string;
    contentType?: string;
    setIsEditable: (editable: boolean) => void;
}

export function EntityDetailHeader({ title, contentType, setIsEditable }: EntityDetailHeaderProps) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    {title}
                </Typography>
                {contentType && (
                    <Typography variant="subtitle1" color="text.secondary">
                        {contentType}
                    </Typography>
                )}
            </Box>
            <Tooltip title="ערוך">
                <IconButton onClick={() => setIsEditable(true)} aria-label="edit">
                    <EditIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
}
