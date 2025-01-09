import { RouterButton } from "@/components/routerComponents/RouterButton";
import { AppBar, Toolbar, Typography, IconButton, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const NavBar = () => {
    const { i18n, t } = useTranslation();
    const { mode, toggleMode } = useTheme();

    const handleLanguageChange = (event: SelectChangeEvent) => {
        i18n.changeLanguage(event.target.value);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {t('welcome')}
                </Typography>
                <RouterButton color="inherit" to="/philosophers">{t('philosophers')}</RouterButton>
                <RouterButton color="inherit" to="/questions">{t('questions')}</RouterButton>
                <RouterButton color="inherit" to="/terms">{t('terms')}</RouterButton>
                <RouterButton color="inherit" to="/about">{t('about')}</RouterButton>
                <RouterButton color="inherit" to="/panel">{t('adminPanel')}</RouterButton>
                <IconButton onClick={toggleMode} color="inherit">
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                <Select
                    value={i18n.language}
                    onChange={handleLanguageChange}
                    sx={{ color: 'inherit', ml: 2 }}
                >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="he">עברית</MenuItem>
                </Select>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;