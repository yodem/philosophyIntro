import { Box, Divider, Typography } from '@mui/material';
import { RouterChip } from './routerComponents/RouterChip';
import { useTranslation } from 'react-i18next';

interface RelatedItemsProps<T> {
    title: string;
    items: T[];
    getLabel: (item: T) => string;
    getLink: (item: T) => { to: string, params: { id: string } };
}

export function RelatedItems<T>({ title, items, getLabel, getLink }: RelatedItemsProps<T>) {
    const { t } = useTranslation();
    if (!items || items.length === 0) return null;

    return (
        <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>{t(title)}</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {items.map(item => (
                    <RouterChip
                        key={getLink(item).params.id}
                        label={getLabel(item)}
                        variant="outlined"
                        {...getLink(item)}
                    />
                ))}
            </Box>
        </>
    );
}
