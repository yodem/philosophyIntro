import { Card, CardContent, Typography } from '@mui/material';
import { BasicEntity } from '@/types';

interface ResourceCardProps {
    resource: BasicEntity;
    onClick: () => void;
}

export default function ResourceCard({ resource, onClick }: ResourceCardProps) {
    return (
        <Card onClick={onClick} sx={{ cursor: 'pointer' }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {resource.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {resource.content}
                </Typography>
            </CardContent>
        </Card>
    );
}
