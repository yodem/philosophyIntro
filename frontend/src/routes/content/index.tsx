import { createFileRoute } from '@tanstack/react-router';
import { contentApi } from '@/api/contentApi';
import { ResourceListPage, ResourceListSkeleton } from '@/components/ResourceDislpay/ResourceListPage';
import { LABELS } from '@/constants';
import { ContentTypes, SearchParams } from '@/types';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export const Route = createFileRoute('/content/')({
    validateSearch: (query: Record<string, unknown>): SearchParams => {
        return {
            page: Number(query.page) || 1,
            limit: Number(query.limit) || 8,
            search: query.search as string || '',
            type: query.type as ContentTypes || ContentTypes.TERM,
        };
    },
    loaderDeps: ({ search }) => ({
        page: search.page,
        limit: search.limit,
        search: search.search,
        type: search.type
    }),
    loader: async ({ deps }) => {
        return await contentApi.getAll(deps);
    },
    pendingComponent: () => <ResourceListSkeleton />,
    component: ContentComponent,
});

function ContentComponent() {
    const navigate = Route.useNavigate();
    const search = Route.useSearch();
    const { items = [], page = 1, total = 0 } = Route.useLoaderData() ?? {};

    const [searchInput, setSearchInput] = useState(search.search || '');
    const debouncedSearch = useDebounce(searchInput, 500);

    // Update URL when debounced search changes
    useEffect(() => {
        // Only navigate if the debounced search is different from the current URL search
        if (debouncedSearch !== search.search) {
            navigate({
                search: (prev) => ({
                    ...prev,
                    search: debouncedSearch,
                    page: 1 // Reset to first page when search changes
                })
            });
        }
    }, [debouncedSearch, navigate, search.search]);

    const handleSearchChange = (searchQuery: string) => {
        setSearchInput(searchQuery);
    };

    const handlePageChange = (newPage: number) => {
        navigate({
            search: (prev) => ({ ...prev, page: newPage })
        });
    };

    const handleContentTypeChange = (contentType: ContentTypes) => {
        navigate({
            search: (prev) => ({
                ...prev,
                type: contentType || undefined,
                page: 1
            })
        });
    };

    const contentTypeLabels: Record<ContentTypes, {
        title: string;
        searchLabel: string;
        addNewLabel: string;
    }> = {
        [ContentTypes.TERM]: {
            title: LABELS.CONCEPT_EXPLORER,
            searchLabel: "חיפוש מושג",
            addNewLabel: LABELS.ADD_NEW_TERM
        },
        [ContentTypes.QUESTION]: {
            title: LABELS.BIG_QUESTIONS,
            searchLabel: "חיפוש שאלה",
            addNewLabel: LABELS.ADD_NEW_QUESTION
        },
        [ContentTypes.PHILOSOPHER]: {
            title: LABELS.BIG_PHILOSOPHERS,
            searchLabel: "חיפוש פילוסוף",
            addNewLabel: LABELS.ADD_NEW_PHILOSOPHER
        }
    };

    const getLabels = () => {
        return contentTypeLabels[search.type] ?? {
            title: "תוכן",
            searchLabel: "חיפוש תוכן",
            addNewLabel: "הוסף תוכן חדש"
        };
    };

    const labels = getLabels();

    return (

        <ResourceListPage
            items={items}
            page={page}
            total={total}
            searchLabel={labels.searchLabel}
            addNewLabel={labels.addNewLabel}
            title={labels.title}
            basePath="/content"
            onAddNew={() => navigate({
                to: '/content/new',
                search: { type: search.type }
            })}
            onItemClick={(id) => navigate({ to: '/content/$id', search: { type: search.type }, params: { id } })}
            onSearch={handleSearchChange}
            onPageChange={handlePageChange}
            currentSearch={searchInput}
            pageSize={search.limit}
            handleContentTypeChange={handleContentTypeChange}
            type={search.type} // Pass the current content type to the component
        />
    );
}
