import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { AuthContextType } from './context/AuthContext';

// Define router context type
export interface RouterContext {
    auth: AuthContextType;
}

// Create router with context
export const router = createRouter({
    routeTree,
    context: {
        // Authentication will be provided by a React component
        auth: undefined!,
    },
});

// Type registration
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
