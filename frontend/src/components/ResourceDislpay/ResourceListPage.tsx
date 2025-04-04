import { Button, TextField, Box, Pagination, Paper, Typography, Divider, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { LABELS } from '@/constants';
import { ContentWithRelations, ContentTypes } from '@/types';
import AddIcon from '@mui/icons-material/Add';
import ResourceGrid from '@/components/ResourceDislpay/ResourceGrid';
import ResourceCard from '@/components/ResourceDislpay/ResourceCard';
import ResourceSkeleton from '@/components/ResourceSkeleton';

interface ResourceListPageProps<T extends ContentWithRelations> {
    items: T[];
    page: number;
    total: number;
    searchLabel: string;
    addNewLabel: string;
    title: string;
    basePath: string;
    onAddNew: () => void;
    onItemClick: (id: string) => void;
    onSearch: (searchQuery: string) => void;
    onPageChange: (newPage: number) => void;
    currentSearch?: string;
    pageSize?: number;
    type: ContentTypes; // Add this prop to handle content type
    handleContentTypeChange: (type: ContentTypes) => void; // Add this prop to handle content type change
}

interface Iprops {
    $currentPage: number;
}

const StyledPagination = styled(Pagination)<Iprops>(({ theme, $currentPage }) => ({
    padding: '10px',
    display: 'flex',
    justifyContent: 'flex-end',

    [theme.breakpoints.down('sm')]: {
        '& li': {
            display: 'none',
        },

        [`& li:nth-child(${$currentPage + 1})`]: {
            display: 'block',
        },

        '& li:first-child': {
            display: 'block',
        },

        '& li:last-child': {
            display: 'block',
        },
    },
}));

export function ResourceListSkeleton() {
    return (
        <ResourceGrid>
            {[1, 2, 3, 4].map((i) => (
                <ResourceSkeleton key={i} />
            ))}
        </ResourceGrid>
    );
}

export function ResourceListPage<T extends ContentWithRelations>({
    items,
    page,
    total,
    searchLabel,
    addNewLabel,
    title,
    onAddNew,
    onItemClick,
    onSearch,
    onPageChange,
    currentSearch = '',
    pageSize = 8,
    type,
    handleContentTypeChange
}: ResourceListPageProps<T>) {
    const [searchValue, setSearchValue] = useState(currentSearch || '');
    const debouncedSearch = useDebounce(searchValue, 300);

    // Only trigger the search if the debounced value actually changed
    useEffect(() => {
        onSearch(debouncedSearch);
    }, [debouncedSearch, onSearch]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
                <Box>
                    <Typography sx={{ textAlign: "center" }} variant='h2'>{title}</Typography>
                </Box>
                <Divider />

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'start' }}>
                    <TextField
                        label={searchLabel}
                        variant="outlined"
                        size='small'
                        value={searchValue}
                        sx={{ textAlign: 'right', width: 300 }}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="content-type-select-label">סוג תוכן</InputLabel>
                        <Select
                            labelId="content-type-select-label"
                            id="content-type-select"
                            value={type}
                            onChange={(e) => handleContentTypeChange(e.target.value as ContentTypes)}
                            label="סוג תוכן"
                        >
                            <MenuItem value={ContentTypes.TERM}>מושגים</MenuItem>
                            <MenuItem value={ContentTypes.QUESTION}>שאלות</MenuItem>
                            <MenuItem value={ContentTypes.PHILOSOPHER}>פילוסופים</MenuItem>
                        </Select>
                    </FormControl>
                    <Button size='medium' variant="contained" onClick={onAddNew} startIcon={<AddIcon />}>
                        {addNewLabel}
                    </Button>
                </Box>

            </Paper>

            {items.length === 0 ? (
                <Box sx={{ textAlign: 'center', m: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <Typography variant='h4'>{LABELS.SEARCH_NOT_FOUND}</Typography>
                    <Typography variant='h5'>שם: "{debouncedSearch}"</Typography>
                </Box>
            ) : (
                <>
                    <ResourceGrid>
                        {items.map((item) => (
                            <ResourceCard
                                key={item.id}
                                resource={item}
                                onClick={() => onItemClick(item.id.toString())}
                            />
                        ))}
                    </ResourceGrid>
                    <StyledPagination
                        count={Math.ceil(total / pageSize)}
                        page={page}
                        $currentPage={page}
                        onChange={(_, value) => onPageChange(value)}
                        sx={{ alignSelf: 'center', direction: 'ltr' }}
                    />
                </>
            )}
        </Box>
    );
}
