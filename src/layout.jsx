import { Outlet, Link, useNavigate } from "react-router";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export function Layout() {
	const navigate = useNavigate()
	return (<>
		<Box sx={{ flexGrow: 1 }}>
		<AppBar position="static">
		<Toolbar>
			<Typography onClick={() => navigate("/")} variant="h6" sx={{ flexGrow: 1 }}>Flashcards</Typography>
		</Toolbar>
		</AppBar>
		</Box>
		<Box sx={{ p: 2}}>
			<Outlet/>
		</Box>
	</>)
}