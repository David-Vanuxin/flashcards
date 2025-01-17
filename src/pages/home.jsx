import { Link } from "react-router";

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import ViewModules from "../modules/ViewModules"

export function Home() {
	return (<>
		<Box>
			<Typography variant="h5">Все модули</Typography>
			<ViewModules />
			<Fab 
				component={Link}
				to="/create" 
				size="medium" 
				color="primary" 
				aria-label="add"
			>
				<AddIcon/>
			</Fab>
		</Box>
	</>)
}