import { Grid } from '@mui/material';
import React from 'react';

interface ResourceGridProps {
    children: React.ReactNode;
}

export default function ResourceGrid({ children }: ResourceGridProps) {
    return (
        <Grid margin={2} container spacing={2} padding={2}>
            {React.Children.map(children, (child) => (
                <Grid item xs={6} md={4} lg={3}>
                    {child}
                </Grid>
            ))}
        </Grid>
    );
}
