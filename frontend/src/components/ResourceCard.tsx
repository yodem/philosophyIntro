import { Card, CardContent, Typography } from '@mui/material';

interface ResourceCardProps {
    title: string;
    onClick: () => void;
}

export default function ResourceCard({ title, onClick }: ResourceCardProps) {
    return (
        <Card onClick={onClick} sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
}
