import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Box, AppBar, Toolbar, Typography, Container, Paper, CircularProgress, Button } from '@mui/material';

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: ({ context, location }) => {
        const { auth } = context;

        if (auth.isLoading) {
            // Let component handle loading state
            return;
        }

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
    const { auth } = Route.useRouteContext();
    const { isLoading, logout } = auth;

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography ml={2} variant="body1">Verifying authentication...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Philosophy App
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button color="inherit" onClick={logout}>Logout</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Outlet />
                </Paper>
            </Container>
        </Box>
    );
}
