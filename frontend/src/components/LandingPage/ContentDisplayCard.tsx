import { Box, Card, CardActions, CardContent, Typography } from '@mui/material';
import { ParseRoute, useNavigate } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
import { RouterButton } from '@/components/routerComponents/RouterButton';
import { useTranslation } from 'react-i18next';

interface ContentDisplayCardProps {
    to?: ParseRoute<typeof routeTree>['fullPath']
    Icon: JSX.Element
    title: string
}

function ContentDisplayCard({ to, Icon, title }: ContentDisplayCardProps) {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const handleNavigate = () => {
        if (to) {
            navigate({ to })

        }
    }

    return (
        <Card sx={{
            cursor: to ? 'pointer' : 'default',
            '&:hover': {
                backgroundColor: to ? 'rgba(0, 0, 0, 0.04)' : 'initial',
            },
            p: 2
        }} onClick={handleNavigate}>
            <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {Icon}
                <Box><Typography variant="h6" component="div">
                    {title}
                </Typography></Box>
            </CardContent>
            {to && <CardActions>
                <RouterButton to={to} variant='outlined'>
                    {t('learnMore')}
                </RouterButton>
            </CardActions>}
        </Card>
    )
}

export default ContentDisplayCard

