import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_admin')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_admin"!</div>
}
