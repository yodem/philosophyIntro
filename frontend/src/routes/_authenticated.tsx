import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '@/context/AuthContext';

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async ({ context, location }) => {
        const { auth } = context;

        if (!auth.isAuthenticated) {
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                },
            });
        }
    },
    component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography ml={2} variant="body1">Verifying authentication...</Typography>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return null; // Prevent rendering if not authenticated
    }

    return (
        <Outlet />
    );
}
