import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/panel')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_admin/"!</div>
}
