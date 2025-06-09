import { Link, useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { useGetModuleByIdQuery, useDeleteModuleMutation } from "../modules/modulesApi"

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import EditIcon from '@mui/icons-material/Edit';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Collapse from '@mui/material/Collapse';

export default function ModuleInfo(props) {
	const { id } = useParams()
	const { data, error, isLoading } = useGetModuleByIdQuery(id)
	const [openDialog, setOpenDialog] = useState(false)
	const navigate = useNavigate()

	if (error) return (<>
		<Typography variant="body1">Что-то пошло не так((</Typography>
	</>)

	if (isLoading) return (<>
		<Typography variant="body1">Загрузка...</Typography>
	</>)

	if (data) {
		if (data.length == 0) return (<>
			<Typography variant="body1">Модуль пуст</Typography>
		</>)
	
		return (<>
			<Typography sx={{textAlign: "center"}} variant="h5">{data.name}</Typography>
			<Box sx={{ display: "flex", justifyContent: "space-around", }}>
				<IconButton size="large" component={Link} to={`/flashcards/${id}`}>
					<ArrowOutwardIcon fontSize="inherit"/>
				</IconButton>
				<IconButton size="large" onClick={() => navigate(`/module/${id}/edit`)}>
					<EditIcon fontSize="inherit"/>
				</IconButton>
				<IconButton size="large" onClick={() => setOpenDialog(true)}>
					<DeleteIcon fontSize="inherit"/>
				</IconButton>
			</Box>
			<Table sx={{ border: "none" }} aria-label="collapsible table">
			<TableBody>
			{
				data.terms.map(t => <Term term={t} key={t.id}/>)
			}
			</TableBody>
			</Table>
			<DeleteConfirm id={id} name={data.name} openDialog={openDialog} setOpenDialog={setOpenDialog}/>
		</>)
	}
}

function DeleteConfirm(props) {
	const navigate = useNavigate()
	const [deleteModule] = useDeleteModuleMutation()

	function onClickDelete() {
		deleteModule(props.id)
		props.setOpenDialog(false)
		navigate("/")
	}

	return (<>
		<Dialog open={props.openDialog}>
			<DialogTitle>Подтвердите действие</DialogTitle>
			<DialogContent>
				<DialogContentText>Удалить модуль <span>{props.name}</span>?</DialogContentText>
				<DialogActions>
					<Button onClick={onClickDelete} variant="outlined">Удалить</Button>
					<Button onClick={() => props.setOpenDialog(false)} variant="contained">Отмена</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	</>)
}

function Term(props) {
	return (<>
		<TableRow sx={{ '& > *': { border: 0 } }}>
			<TableCell>{props.term.answer}</TableCell>
			<TableCell>{props.term.question}</TableCell>
		</TableRow>
	</>)
}