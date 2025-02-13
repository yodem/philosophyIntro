import { Card, CardContent, Typography, CardMedia, Box, Grow } from '@mui/material';
import { BasicEntity } from '@/types';

interface ResourceCardProps {
    resource: BasicEntity;
    onClick: () => void;
}

export default function ResourceCard({ resource, onClick }: ResourceCardProps) {
    const image = resource.images?.faceImages?.face250x250 || resource.images?.banner400x300;

    return (
        <Grow in={true} timeout={500}>
            <Card
                onClick={onClick}
                sx={{
                    display: 'flex',
                    cursor: 'pointer',
                    height: 200,
                    '&:hover': {
                        boxShadow: 6
                    }
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h5" noWrap>
                            {resource.title}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {resource.description}
                        </Typography>
                    </CardContent>
                </Box>
                {image && (
                    <CardMedia
                        component="img"
                        sx={{ width: 150 }}
                        image={image}
                        alt={resource.title}
                    />
                )}
            </Card>
        </Grow>
    );
}
