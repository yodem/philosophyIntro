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
  loaderDeps: ({ search }) => {
    const { limit, page, search: searchQuery } = search;
    return ({ page: page || 1, limit: limit || 8, search: searchQuery || '' })
  },
  loader: async ({ deps }) => {
    return await philosophersApi.getAll(deps);
  },
  pendingComponent: () => <ResourceListSkeleton />,
  component: PhilosophersComponent,
});

function PhilosophersComponent() {
  const navigate = Route.useNavigate();
  const { items = [], page = 1, total = 0 } = Route.useLoaderData() ?? {};

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
    />
  );
}
