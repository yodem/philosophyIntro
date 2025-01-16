import { createFileRoute } from '@tanstack/react-router';
import { termsApi } from '@/api';
import { ResourceListPage, ResourceListSkeleton } from '@/components/ResourceListPage';
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
    loaderDeps: ({ search }) => {
        const { limit, page, search: searchQuery } = search;
        return ({ page: page || 1, limit: limit || 8, search: searchQuery || '' })
    },
    loader: async ({ deps }) => {
        return await termsApi.getAll(deps);
    },
    pendingComponent: () => <ResourceListSkeleton />,
    component: TermsComponent,
});

function TermsComponent() {
    const navigate = Route.useNavigate();
    const { items = [], page = 1, total = 0 } = Route.useLoaderData() ?? {};

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
        />
    );
}
