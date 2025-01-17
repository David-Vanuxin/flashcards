import { Outlet, Link } from "react-router";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';

export function Layout() {
	return (<>
		<Box sx={{ flexGrow: 1 }}>
		<AppBar position="static">
		<Toolbar>
			<Typography variant="h6" sx={{ flexGrow: 1 }}>Flashcards</Typography>
			<Button color="inherit" component={Link} to="/"><HomeIcon /></Button>
			<Button color="inherit" component={Link} to="/info">Справка</Button>
		</Toolbar>
		</AppBar>
		</Box>
		<Box sx={{ p: 2}}>
			<Outlet/>
		</Box>
	</>)
}