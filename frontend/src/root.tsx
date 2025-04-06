import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { RouterContext } from "./router";

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => (
        <ThemeProvider>
            <Outlet />
        </ThemeProvider>
    ),
});
