import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/terms/$id"!</div>
}
