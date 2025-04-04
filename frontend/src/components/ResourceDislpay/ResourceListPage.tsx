import { Button, TextField, Box, Pagination, Paper, Typography, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { LABELS } from '@/constants';
import { Content, ContentType } from '@/types';
import AddIcon from '@mui/icons-material/Add';
import ResourceGrid from '@/components/ResourceDislpay/ResourceGrid';
import ResourceCard from '@/components/ResourceDislpay/ResourceCard';
import ResourceSkeleton from '@/components/ResourceSkeleton';

interface ResourceListPageProps<T extends Content> {
    items: T[];
    page: number;
    total: number;
    searchLabel: string;
    addNewLabel: string;
    title: string;
    basePath: string;
    contentType?: ContentType; // Add content type for filtering
    onAddNew: () => void;
    onItemClick: (id: string) => void;
    onSearch: (searchQuery: string) => void;
    onPageChange: (newPage: number) => void;
    currentSearch?: string;
    pageSize?: number;
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

export function ResourceListPage<T extends Content>({
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
