import { Link, useNavigate } from "react-router";
import { useGetAllModulesQuery } from "../modules/modulesApi"

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

export default function Home() {
	return (<>
		<Box>
			<Typography sx={{textAlign: "center"}} variant="h5">Все модули</Typography>
			<ListModules />
			<Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
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
		</Box>
	</>)
}

function ListModules(props) {
	const { data, error, isLoading } = useGetAllModulesQuery()

	if (error) return (<>
		<Typography variant="body1">Что-то пошло не так((</Typography>
	</>)

	if (isLoading) return (<>
		<Typography variant="body1">Загрузка...</Typography>
	</>)

	if (data) {
		if (data.length == 0) return (<>
			<Typography variant="body1">Чтобы создать модуль нажмите кнопку "+"</Typography>
		</>)

		return (<>
			<Table sx={{ border: "none" }} aria-label="collapsible table">
			<TableBody>
			{
				data.map(mod => <ModuleName key={mod.id} mod={mod}/>)
			}
			</TableBody>
			</Table>
		</>)
	}

}
function ModuleName(props) {
	const navigate = useNavigate()
	return (<>
		<TableRow
			onClick={() => navigate(`/module/${props.mod.id}`)} 
			sx={{ '& > *': { border: 0 } }}>
		<TableCell>
			{props.mod.name}
		</TableCell>
		</TableRow>
	</>)
}