import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/philosophers/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/philosophers/$id"!</div>
}
