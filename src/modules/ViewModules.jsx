import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { useGetAllModulesQuery, useGetModuleByIdQuery, useDeleteModuleMutation } from "./modulesApi"

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

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

export default function ViewModules(props) {
	// const modules = useSelector(state => state.modules.modules)
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
				data.map(mod => <Module mod={mod} key={mod.id}/>)
			}
			</TableBody>
			</Table>
		</>)
	}
}

function Module(props) {
	const [expanded, setExpanded] = useState(false)
	const [openDialog, setOpenDialog] = useState(false)
	const [deleteModule] = useDeleteModuleMutation()

	function onClickDelete() {
		deleteModule(props.mod.id)
		setOpenDialog(false)
	}

	return (<>
		<TableRow sx={{ '& > *': { border: 0 } }}>
			<TableCell>
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
			</TableCell>
			<TableCell align="left">{props.mod.name}</TableCell>
			<TableCell align="left">
				<IconButton size="small" component={Link} to={`flashcards/${props.mod.id}`}>
					<ArrowOutwardIcon />
				</IconButton>
			</TableCell>
			<TableCell>
			<IconButton size="small" onClick={() => setOpenDialog(true)}>
				<DeleteIcon />
			</IconButton>
			</TableCell>
		</TableRow>
		<TableRow sx={{ '& > *': { border: 0 } }}>
			<TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
			<Table sx={{ border: "none" }} size="small" aria-label="purchases">
				<TableHead>
				<TableRow>
					<TableCell>Термин</TableCell>
					<TableCell>Значение</TableCell>
				</TableRow>
				</TableHead>
				<TableBody>
				{
					props.mod.terms.map((term, i) => <Term term={term} key={i + 1000}/>)
				}
				</TableBody>
			</Table>
			</Collapse>
		</TableCell>
		</TableRow>
		<Dialog open={openDialog}>
			<DialogTitle>Подтвердить</DialogTitle>
			<DialogContent>
				<DialogContentText>Удалить модуль <span>{props.mod.name}</span>?</DialogContentText>
				<DialogActions>
					<Button onClick={onClickDelete} variant="outlined">Удалить</Button>
					<Button onClick={() => setOpenDialog(false)} variant="contained">Отмена</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	</>)
}

function Term(props) {
	return (<>
		<TableRow sx={{ '& > *': { border: 0 } }}>
			<TableCell>{props.term.question}</TableCell>
			<TableCell>{props.term.answer}</TableCell>
		</TableRow>
	</>)
}