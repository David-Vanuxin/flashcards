import { createModule } from "./modulesSlice"
import { useDispatch } from "react-redux"
import { useState } from "react"

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

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
		<Typography variant="body1">Перед добавлением убедитесь, что:</Typography>
		<List>
			<ListItem><ListItemText variant="body2">Каждая пара начинается с новой строки</ListItemText></ListItem>
			<ListItem><ListItemText variant="body2">На каждой строке есть разделитель</ListItemText></ListItem>
		</List>
    <TextField
    	fullWidth
    	onChange={event=>setText(event.target.value)}
      label="Впишите сюда пары значений"
      placeholder="Образец: яблоко _ apple"
      multiline
      rows={6}
    />
		<div className="buttons-wrapper">
			<Button variant="contained" onClick={() => dispatch(createModule({name, separator, text}))}>Сохранить</Button>
			<Button variant="outlined">Отмена</Button>
		</div>
	</>)
}