import * as React from 'react'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import NavBar from '@/components/NavBar'
import { SnackbarProvider } from 'notistack'
import { RouterContext } from '@/main'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <SnackbarProvider maxSnack={3}>
        <NavBar />
        <Outlet />
      </SnackbarProvider>
    </React.Fragment>
  )
}
