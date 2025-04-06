import { createFileRoute } from '@tanstack/react-router'
import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material'
import { contentApi } from '@/api/contentApi'
import { LABELS } from '@/constants'
import { EntityDetailView } from '@/components/EntityDetailView'
import { useEntityUpdate } from '@/hooks/useEntityUpdate'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { ContentTypes, SearchParams } from '@/types'

function ContentSkeleton() {
  return (
    <Box p={2}>
      <Card>
        <CardContent>
          <Skeleton variant="text" height={40} />
          <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
          {/* ...other skeleton elements... */}
        </CardContent>
      </Card>
    </Box>
  )
}

// Define the content query options
export const contentQueryOptions = (
  contentId: string,
  contentType?: ContentTypes,
) =>
  queryOptions({
    queryKey: ['content', contentId, contentType],
    queryFn: () => contentApi.getOne(contentId, contentType),
  })

export const Route = createFileRoute('/_authenticated/content/$id')({
  validateSearch: (query: Record<string, unknown>): SearchParams => ({
    type: (query.type as ContentTypes) || ContentTypes.TERM,
  }),
  loaderDeps: ({ search: { type } }) => ({
    contentType: type,
  }),
  loader: ({ params: { id }, deps: { contentType } }) =>
    contentQueryOptions(id, contentType),
  pendingComponent: ContentSkeleton,
  component: ContentComponent,
})

function ContentComponent() {
  const { id } = Route.useParams()
  const { type: contentType } = Route.useSearch()
  const queryOptions = Route.useLoaderData()
  const { data: content } = useSuspenseQuery(queryOptions)

  const updateContent = useEntityUpdate(content.type, (id, data) =>
    contentApi.update(id, {
      ...data,
      type: content?.type ?? contentType ?? ContentTypes.TERM,
    }),
  )

  if (!content) {
    return <Typography variant="h6">{LABELS.CONTENT_NOT_FOUND}</Typography>
  }

  return (
    <EntityDetailView
      entity={content}
      updateMutation={updateContent}
      queryKey={['content', id, content.type]}
    />
  )
}
