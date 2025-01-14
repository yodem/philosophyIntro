import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import NavBar from '@/components/NavBar'
import { SnackbarProvider } from 'notistack'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <NavBar />
      <SnackbarProvider maxSnack={3}>
        <Outlet />
      </SnackbarProvider>
    </React.Fragment>
  )
}
