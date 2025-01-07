import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/philosophers/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/philosophers/"!</div>
}
