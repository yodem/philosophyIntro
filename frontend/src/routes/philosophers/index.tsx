import { createFileRoute } from '@tanstack/react-router';
import { philosophersApi } from '@/api';
import { ResourceListPage, ResourceListSkeleton } from '@/components/ResourceDislpay/ResourceListPage';
import { LABELS } from '@/constants';
import { SearchParams } from '@/types';

export const Route = createFileRoute('/philosophers/')({
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
    return await philosophersApi.getAll(deps);
  },
  pendingComponent: () => <ResourceListSkeleton />,
  component: PhilosophersComponent,
});

function PhilosophersComponent() {
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
      searchLabel="חיפוש פילוסוף"
      addNewLabel={LABELS.ADD_NEW_PHILOSOPHER}
      title={LABELS.BIG_PHILOSOPHERS}
      basePath="/philosophers"
      onAddNew={() => navigate({ to: '/philosophers/new' })}
      onItemClick={(id) => navigate({ to: '/philosophers/$id', params: { id } })}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
      currentSearch={search.search}
      pageSize={search.limit}
    />
  );
}
