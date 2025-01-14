import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import { BasicEntity } from '@/types';

interface ResourceCardProps {
    resource: BasicEntity;
    onClick: () => void;
}

export default function ResourceCard({ resource, onClick }: ResourceCardProps) {
    return (
        <Card onClick={onClick} sx={{ cursor: 'pointer', width: 300, height: 400 }}>
            {resource.images?.faceImages?.face250x250 && (
                <CardMedia
                    component="img"
                    height="250"
                    image={resource.images.faceImages.face250x250}
                    alt={resource.title}
                />
            )}
            <CardContent>
                <Typography variant="h5" component="div">
                    {resource.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {resource.description}
                </Typography>
            </CardContent>
        </Card>
    );
}
