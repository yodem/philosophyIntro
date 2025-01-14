import { RouterButton } from "@/components/routerComponents/RouterButton";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { useTheme } from '../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { LABELS } from '@/constants';

const NavBar = () => {
    const { mode, toggleMode } = useTheme();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {LABELS.WELCOME}
                </Typography>
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