import { Card, CardContent, Grid, Typography, Button } from '@mui/material';

interface EntityListProps {
    items: any[];
    onItemClick: (id: string | number) => void;
    onAddNew: () => void;
    config: {
        addNewLabel: string;
        gridProps?: {
            xs?: number;
            md?: number;
            lg?: number;
        };
        renderItem: (item: any) => {
            title: string;
            subtitle?: string;
            content?: React.ReactNode;
        };
    };
}

export function EntityList({ items, onItemClick, onAddNew, config }: EntityListProps) {
    return (
        <>
            <Button variant="outlined" onClick={onAddNew}>
                {config.addNewLabel}
            </Button>
            <Grid container spacing={2} padding={2}>
                {items?.map((item) => {
                    const rendered = config.renderItem(item);
                    return (
                        <Grid item {...(config.gridProps || { xs: 12, md: 6 })} key={item.id}>
                            <Card>
                                <CardContent onClick={() => onItemClick(item.id)} sx={{ cursor: 'pointer' }}>
                                    <Typography variant="h5" gutterBottom>
                                        {rendered.title}
                                    </Typography>
                                    {rendered.subtitle && (
                                        <Typography color="text.secondary">
                                            {rendered.subtitle}
                                        </Typography>
                                    )}
                                    {rendered.content}
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
}
