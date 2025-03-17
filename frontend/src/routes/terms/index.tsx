import { createFileRoute } from '@tanstack/react-router';
import { termsApi } from '@/api';
import { ResourceListPage, ResourceListSkeleton } from '@/components/ResourceDislpay/ResourceListPage';
import { LABELS } from '@/constants';
import { SearchParams } from '@/types';

export const Route = createFileRoute('/terms/')({
    validateSearch: (query: Record<string, unknown>): SearchParams => {
        return {
            page: Number(query.page) || 1,
            limit: Number(query.limit) || 8,
            search: query.search as string || '',
        };
    },
    loaderDeps: ({ search }) => ({
        page: search.page,
        limit: search.limit,
        search: search.search
    }),
    loader: async ({ deps }) => {
        return await termsApi.getAll(deps);
    },
    pendingComponent: () => <ResourceListSkeleton />,
    component: TermsComponent,
});

function TermsComponent() {
    const navigate = Route.useNavigate();
    const search = Route.useSearch();
    const { items = [], page = 1, total = 0 } = Route.useLoaderData() ?? {};

    const handleSearch = (searchQuery: string) => {
        navigate({
            search: (prev) => ({ ...prev, search: searchQuery, page: 1 })
        });
    };

    const handlePageChange = (newPage: number) => {
        navigate({
            search: (prev) => ({ ...prev, page: newPage })
        });
    };

    return (
        <ResourceListPage
            items={items}
            page={page}
            total={total}
            searchLabel="חיפוש מושג"
            addNewLabel={LABELS.ADD_NEW_TERM}
            title={LABELS.CONCEPT_EXPLORER}
            basePath="/terms"
            onAddNew={() => navigate({ to: '/terms/new' })}
            onItemClick={(id) => navigate({ to: '/terms/$id', params: { id } })}
            onSearch={handleSearch}
            onPageChange={handlePageChange}
            currentSearch={search.search}
            pageSize={search.limit}
        />
    );
}
