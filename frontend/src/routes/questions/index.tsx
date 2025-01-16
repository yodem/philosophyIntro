import { createFileRoute } from '@tanstack/react-router';
import { questionsApi } from '@/api';
import { ResourceListPage, ResourceListSkeleton } from '@/components/ResourceListPage';
import { LABELS } from '@/constants';
import { SearchParams } from '@/types';

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
        return ({ page: page || 1, limit: limit || 8, search: searchQuery || '' })
    },
    loader: async ({ deps }) => {
        return await questionsApi.getAll(deps);
    },
    pendingComponent: () => <ResourceListSkeleton />,
    component: QuestionsComponent,
});

function QuestionsComponent() {
    const navigate = Route.useNavigate();
    const { items = [], page = 1, total = 0 } = Route.useLoaderData() ?? {};

    return (
        <ResourceListPage
            items={items}
            page={page}
            total={total}
            searchLabel="חיפוש שאלה"
            addNewLabel={LABELS.ADD_NEW_QUESTION}
            title={LABELS.BIG_QUESTIONS}
            basePath="/questions"
            onAddNew={() => navigate({ to: '/questions/new' })}
            onItemClick={(id) => navigate({ to: '/questions/$id', params: { id } })}
        />
    );
}
