import { createModule } from "./modulesSlice"
import { useDispatch } from "react-redux"
import { useState } from "react"
import { Link } from "react-router";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function CreateModule() {
	const dispatch = useDispatch()
	const [name, setName] = useState("")
	const [text, setText] = useState("")
	const [separator, setSeparator] = useState("")

	return (<>
		<Typography variant="h5">Создать новый модуль</Typography>
		<div className="buttons-wrapper">
			<TextField style={{ width: "50%" }} onChange={event=>setName(event.target.value)} label="Имя модуля" variant="outlined" placeholder="Новый модуль"/>
		</div>
		<div className="buttons-wrapper">
			<TextField style={{ width: "50%" }} onChange={event=>setName(event.target.value)} label="Разделитель" variant="outlined" placeholder="Например: _"/>
		</div>
		<Accordion /*style={{width: "95%"}}*/>
			<AccordionSummary 
				expandIcon={<ArrowDropDownIcon />}
        aria-controls="panel-content"
        id="panel-header">
				<Typography variant="body1">Правила ввода</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Typography variant="body1">Перед добавлением убедитесь, что:</Typography>
				<List>
					<ListItem><ListItemText primary="Каждая пара начинается с новой строки" variant="body2"/></ListItem>
					<ListItem><ListItemText primary="На каждой строке есть разделитель" variant="body2"/></ListItem>
				</List>
			</AccordionDetails>
		</Accordion>
    <TextField
    	fullWidth
    	onChange={event=>setText(event.target.value)}
      label="Впишите сюда пары значений"
      placeholder="Образец: яблоко _ apple"
      multiline
      rows={6}
    />
		<div className="buttons-wrapper">
			<Button component={Link} to="/" variant="contained" onClick={() => dispatch(createModule({name, separator, text}))}>Сохранить</Button>
			<Button component={Link} to="/" variant="outlined">Отмена</Button>
		</div>
	</>)
}