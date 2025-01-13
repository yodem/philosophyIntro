import { Card, CardContent, Typography } from '@mui/material';
import { BasicEntity } from '@/types';
import { useTranslation } from 'react-i18next';

interface ResourceCardProps {
    resource: BasicEntity;
    onClick: () => void;
}

export default function ResourceCard({ resource, onClick }: ResourceCardProps) {
    const { i18n } = useTranslation();
    const isEnglish = i18n.language === 'en';

    return (
        <Card onClick={onClick} sx={{ cursor: 'pointer' }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {isEnglish ? resource.titleEn : resource.titleHe}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {isEnglish ? resource.contentEn : resource.contentHe}
                </Typography>
            </CardContent>
        </Card>
    );
}
