import { RouterButton } from "@/components/routerComponents/RouterButton";
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import { useTheme } from '../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate } from "@tanstack/react-router";
import philosopherIcon from "@/assets/philosopher.png";
const NavBar = () => {
    const { mode, toggleMode } = useTheme();
    const navigate = useNavigate()
    return (
        <AppBar position="fixed">
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Box
                        component={"img"}
                        onClick={() => navigate({ to: "/" })} sx={{ ":hover": { cursor: "pointer" }, height: '40px', marginRight: '10px' }}
                        src={philosopherIcon}
                        alt="philosopherIcon"
                    />
                </Box>
                <RouterButton color="inherit" to="/philosophers">פילוסופים</RouterButton>
                <RouterButton color="inherit" to="/questions">שאלות</RouterButton>
                <RouterButton color="inherit" to="/terms">מושגים</RouterButton>
                <RouterButton color="inherit" to="/about">אודות</RouterButton>
                <RouterButton color="inherit" to="/panel">ניהול</RouterButton>
                <IconButton onClick={toggleMode} color="inherit">
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;