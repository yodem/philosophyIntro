import { RouterButton } from "@/components/routerComponents/RouterButton"
import { AppBar, Toolbar, Typography } from "@mui/material"

const NavBar = () =>
    <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Philosophy
            </Typography>
            <RouterButton color="inherit" to="/philosophers">Philosophers</RouterButton>
            <RouterButton color="inherit" to="/questions">Questions</RouterButton>
            <RouterButton color="inherit" to="/terms">Terms</RouterButton>
            <RouterButton color="inherit" to="/about">About</RouterButton>
            <RouterButton color="inherit" to="/panel">Admin Panel</RouterButton>
        </Toolbar>
    </AppBar>


export default NavBar