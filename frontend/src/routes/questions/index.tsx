import { createFileRoute } from '@tanstack/react-router';
import { questionsApi } from '@/api';
import { Button, TextField, Box, Pagination, Paper, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import ResourceCard from '@/components/ResourceCard'; // Import the generic component
import ResourceGrid from '@/components/ResourceGrid'; // Import the generic grid component
import ResourceSkeleton from '@/components/ResourceSkeleton';
import { LABELS } from '@/constants';
import { SearchParams } from '@/types';

function QuestionsSkeleton() {
    return (
        <ResourceGrid>
            {[1, 2, 3, 4].map((i) => (
                <ResourceSkeleton key={i} />
            ))}
        </ResourceGrid>
    );
}

export const Route = createFileRoute('/questions/')({
    validateSearch: (query: Record<string, unknown>): SearchParams => {
        return {
            page: Number(query.page) || 1,
            limit: Number(query.limit) || 8,
            search: query.search as string || '',
        };
    },
    loaderDeps: ({ search }) => {
        const { limit, page, search: searchQuery } = search;
        const pageNumber = page || 1;
        const limitNumber = limit || 8;
        const searchQueryValue = searchQuery || '';
        return ({ page: pageNumber, limit: limitNumber, search: searchQueryValue })
    },
    loader: async ({ deps }) => {
        const { limit, page, search } = deps;
        const pageNumber = page || 1;
        const limitNumber = limit || 8;
        const searchQuery = search || '';
        return (await questionsApi.getAll({ page: pageNumber, limit: limitNumber, search: searchQuery }));
    },
    pendingComponent: () => <QuestionsSkeleton />,
    component: QuestionsComponent,
});

function QuestionsComponent() {
    const navigate = Route.useNavigate();
    const loaderData = Route.useLoaderData();
    const questions = loaderData?.items || [];
    const page = loaderData?.page || 1;
    const total = loaderData?.total || 0;

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        navigate({
            search: (prev) => ({
                ...prev,
                search: debouncedSearch,
                page: 1
            }),
        });
    }, [debouncedSearch, navigate]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper sx={{ display: 'flex', gap: 2, padding: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                <TextField
                    label="חיפוש שאלה"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="outlined" onClick={() => navigate({ to: '/questions/new' })}>
                    {LABELS.ADD_NEW_QUESTION}
                </Button>
            </Paper>
            <Typography sx={{ textAlign: "center" }} variant='h4'>{LABELS.BIG_QUESTIONS}</Typography>

            {questions.length === 0 ? <Box sx={{ textAlign: 'center', m: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Typography variant='h4'>{LABELS.SEARCH_NOT_FOUND}</Typography>
                <Typography variant='h5'>שם: "{debouncedSearch}"</Typography>
            </Box> : <>
                <ResourceGrid>
                    {questions?.map((question) => (
                        <ResourceCard
                            key={question.id}
                            resource={question}
                            onClick={() => navigate({ to: '/questions/$id', params: { id: question.id.toString() } })}
                        />
                    ))}
                </ResourceGrid>
                <Pagination
                    count={Math.ceil(total / 8)}
                    page={page}
                    onChange={(_, value) => navigate({ to: '/questions', search: (prev) => ({ ...prev, page: value }) })}
                    sx={{ alignSelf: 'center', direction: 'ltr' }}
                />
            </>}


        </Box >
    );
}
