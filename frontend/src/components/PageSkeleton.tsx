import { Card, CardContent, Grid, Skeleton } from '@mui/material';

interface PageSkeletonProps {
    type?: 'grid' | 'list';
    count?: number;
    gridProps?: {
        xs?: number;
        md?: number;
        lg?: number;
    };
}

export function PageSkeleton({ type = 'grid', count = 4, gridProps = { xs: 12, md: 6 } }: PageSkeletonProps) {
    return (
        <Grid container spacing={2} padding={2}>
            {Array.from({ length: count }).map((_, i) => (
                <Grid item {...gridProps} key={i}>
                    <Card>
                        <CardContent>
                            <Skeleton variant="text" height={32} />
                            <Skeleton variant="rectangular" height={60} />
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
