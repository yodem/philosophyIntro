import { RouterButton } from "@/components/routerComponents/RouterButton";
import { AppBar, Toolbar, IconButton, Box, Button, Typography, Avatar, Menu, MenuItem } from "@mui/material";
import { useTheme } from '../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate, useLocation } from "@tanstack/react-router";
import philosopherIcon from "@/assets/philosopher.png";
import { ContentTypes } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { AUTH_TOKEN } from "@/constants";
import { useSnackbar } from 'notistack';

const NavBar = () => {
    const { mode, toggleMode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const { user, isAuthenticated, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { enqueueSnackbar } = useSnackbar();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logout();
        navigate({ to: "/login", search: { redirect: location.pathname } });
        enqueueSnackbar('התנתקת בהצלחה', { variant: 'success' });
    };

    const handleCopyToken = () => {
        const accessToken = localStorage.getItem(AUTH_TOKEN)
        if (accessToken) {
            navigator.clipboard.writeText(accessToken);
            enqueueSnackbar('הטוקן הועתק בהצלחה', { variant: 'success' });
            handleClose();
        }
    };

    const handleLoginClick = () => {
        navigate({ to: "/login", search: { redirect: location.pathname } });
        enqueueSnackbar('נא התחבר', { variant: 'info' });
    };

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Box
                        component={"img"}
                        onClick={() => navigate({ to: "/" })} sx={{ ":hover": { cursor: "pointer" }, height: '40px', marginRight: '10px' }}
                        src={philosopherIcon}
                        alt="philosopherIcon"
                    />
                </Box>
                <RouterButton color="inherit" to="/content" search={{ type: ContentTypes.PHILOSOPHER }}>פילוסופים</RouterButton>
                <RouterButton color="inherit" to="/content" search={{ type: ContentTypes.QUESTION }}>שאלות</RouterButton>
                <RouterButton color="inherit" to="/content" search={{ type: ContentTypes.TERM }}>מושגים</RouterButton>
                {/* <RouterButton color="inherit" to="/about">אודות</RouterButton>
                <RouterButton color="inherit" to="/panel">ניהול</RouterButton> */}

                {isAuthenticated ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        <Avatar
                            sx={{ width: 32, height: 32, mr: 1, backgroundColor: 'primary.dark', cursor: 'pointer' }}
                            onClick={handleClick}
                        >
                            {user?.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body1" sx={{ mr: 1, cursor: 'pointer' }} onClick={handleClick}>
                            {user?.username}
                        </Typography>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleCopyToken}>העתק טוקן</MenuItem>
                            <MenuItem onClick={handleLogout}>התנתק</MenuItem>
                        </Menu>
                    </Box>
                ) : (
                    <Button
                        color="inherit"
                        onClick={handleLoginClick}
                    >
                        התחבר
                    </Button>
                )}

                <IconButton onClick={toggleMode} color="inherit">
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;