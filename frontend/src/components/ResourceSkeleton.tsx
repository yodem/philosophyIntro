import { Card, CardContent, Skeleton } from '@mui/material';

export default function ResourceSkeleton() {
    return (
        <Card>
            <CardContent>
                <Skeleton variant="text" height={40} />
            </CardContent>
        </Card>
    );
}
