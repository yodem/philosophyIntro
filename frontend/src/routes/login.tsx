import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button, TextField, Box, Typography, Container, Alert } from "@mui/material";

export const Route = createFileRoute("/login")({
    validateSearch: (search: Record<string, unknown>) => {
        return {
            redirect: search.redirect as string | undefined,
        };
    },
    component: LoginPage,
});

function LoginPage() {
    const { auth } = Route.useRouteContext();
    const { login } = auth;
    const search = Route.useSearch();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login(username, password);

            // Redirect after successful login
            if (search.redirect) {
                window.location.href = search.redirect;
            } else {
                navigate({ to: "/" });
            }
        } catch {
            setError("Invalid username or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
