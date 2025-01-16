import { Grid } from '@mui/material';
import React from 'react';

interface ResourceGridProps {
    children: React.ReactNode;
}

export default function ResourceGrid({ children }: ResourceGridProps) {
    return (
        <Grid container spacing={2} padding={3}>
            {React.Children.map(children, (child) => (
                <Grid item xs={12} md={6} lg={4} xl={3}>
                    {child}
                </Grid>

            ))}
        </Grid>
    );
}
