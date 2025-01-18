import { Outlet, Link } from "react-router";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';

export function Layout() {
	return (<>
		<Box sx={{ flexGrow: 1 }}>
		<AppBar position="static">
		<Toolbar>
			<Typography variant="h6" sx={{ flexGrow: 1 }}>Flashcards</Typography>
			<IconButton color="inherit" component={Link} to="/"><HomeIcon /></IconButton>
			<IconButton color="inherit" component={Link} to="/info"><InfoIcon /></IconButton>
		</Toolbar>
		</AppBar>
		</Box>
		<Box sx={{ p: 2}}>
			<Outlet/>
		</Box>
	</>)
}