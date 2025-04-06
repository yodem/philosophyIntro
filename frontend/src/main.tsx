import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth, AuthContextType } from './context/AuthContext';
import "../index.css";

// Define router context type
export interface RouterContext {
  auth: AuthContextType;
}

const queryClient = new QueryClient();

// Create router with context
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

// Type registration
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Component to connect auth context to router
function AppWithAuth() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CssBaseline enableColorScheme />
        <AuthProvider>
          <AppWithAuth />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);