import { Link, useParams, useNavigate } from "react-router";
import { useState, useEffect, useId } from "react";
import { useGetModuleByIdQuery, useRenameModuleMutation } from "../api/modulesApi"

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { grey } from '@mui/material/colors';


export default function EditModule() {
  const { id } = useParams()
  const field = useId()
  const { data } = useGetModuleByIdQuery(id)
  const [saveBtnEnabled, setSaveBtnEnabled] = useState(false)
  const [renameModule] = useRenameModuleMutation()
  const [newModuleName, setNewModuleName] = useState("")

  function changeHandler(event) {
    if (event.target.value !== data.name) {
      setSaveBtnEnabled(true)
      console.log(event.target.value)
      setNewModuleName(event.target.value)
    }
    else {
      setSaveBtnEnabled(false)
      setNewModuleName("")
    }
  }

  function saveNewName() {
    if (newModuleName) {
      renameModule({id, name: newModuleName})
      setSaveBtnEnabled(false)
    }
  }

  function cancel() {
    document.getElementById(field).value = data.name
    setSaveBtnEnabled(false)
  }

  if (data) {
    return (<>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <TextField id={field} onChange={changeHandler} defaultValue={data.name} label="Имя модуля" variant="outlined" placeholder="Введите новое имя"/>
        <SaveButtonsGroup show={saveBtnEnabled} save={saveNewName} cancel={cancel}/>
        <TermsList terms={data.terms}/>
      </Box>
    </>)
  }
}

function SaveButtonsGroup({ show, save, cancel }) {
  const { id } = useParams()

  if (show) return (<>
    <Box sx={{ display: "flex", justifyContent: "end", gap: 1 }}>
      <Button variant="contained" onClick={save}>Сохранить</Button>
      <Button variant="outlined" onClick={cancel}>Отмена</Button>
    </Box>
  </>)
}

function TermsList({ terms }) {
  const [selected, setSelected] = useState([])
  const [botMenuHidden, setBotMenuHidden] = useState(true)
  const [generalCheckboxChecked, setGeneralCheckboxChecked] = useState(false)

  function selectAll() {
    setSelected(selected => [...terms.map(term => term.id)])
  }

  function removeAllSelected() {
    setSelected([])
  }

  function handleGeneralCheckboxChange(event) {
    setGeneralCheckboxChecked(checked => {
      if (!checked) selectAll()// current state value still false
      else removeAllSelected() 

      return !checked
    })
  }

  useEffect(() => {
    if (selected.length === terms.length) setGeneralCheckboxChecked(true)
    else setGeneralCheckboxChecked(false)
  }, [selected])

  return (<>
    <Table sx={{ mb: 5 }}>
    <TableHead>
    <TableRow>
      <TableCell><Checkbox checked={generalCheckboxChecked} onChange={handleGeneralCheckboxChange} size="small" />Все</TableCell>
      <TableCell>Термин</TableCell>
      <TableCell>Значение</TableCell>
    </TableRow>
    </TableHead>
    <TableBody>
    {
      terms.map(t => <Term selected={selected} setSelected={setSelected} term={t} key={t.id}/>)
    }
    </TableBody>
    </Table>
    <BottomMenu selected={selected} removeAllSelected={removeAllSelected}/>
  </>)
}

function Term({ term: { id, answer, question }, selected, setSelected }) {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (selected.includes(id)) setChecked(true)
    else setChecked(false)
  }, [selected])

  function addSelected() {
    setSelected(arr => {
      const updatedArr = [...arr]
      if (!arr.includes(id)) updatedArr.push(id)
      return updatedArr
    })
  }

  function removeSelection() {
    setSelected(selected => selected.filter(termId => termId !== id))
  }

  function handleCheckboxChange() {
    setChecked(checked => {
      if (!checked) addSelected(id)
      else removeSelection(id)

      return !checked
    })
  }

  return (<>
    <TableRow sx={{ '& > *': { border: 0 } }}>
      <TableCell>
        <Checkbox size="small" checked={checked} onChange={handleCheckboxChange}/>
      </TableCell>
      <TableCell>{answer}</TableCell>
      <TableCell>{question}</TableCell>
    </TableRow>
  </>)
}

function BottomMenu({ selected, removeAllSelected }) {
  if (selected.length !== 0) return (<>
    <AppBar position="fixed" sx={{ bgcolor: 'white', top: 'auto', bottom: 0 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        <Typography variant="button" gutterBottom sx={{ color: "text.primary", p: 1, m: 1 }}>Выбрано: {selected.length}</Typography>
        <Button variant="contained">Изменить</Button>
        <Button>Удалить</Button>
        <Button onClick={removeAllSelected} variant="outlined">Отменить</Button>
      </Toolbar>
    </AppBar>
  </>)
}
