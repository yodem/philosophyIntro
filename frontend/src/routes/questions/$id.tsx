import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/questions/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/questions/$id"!</div>
}
