import { Link, useParams, useNavigate } from "react-router";
import { useState } from "react"
import { useGetModuleByIdQuery, useRenameModuleMutation } from "../modules/modulesApi"
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function EditModule() {
  const { id } = useParams()
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
    if (newModuleName) renameModule({id, name: newModuleName})
  }

  if (data) {
    return (<>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <TextField onChange={changeHandler} defaultValue={data.name} label="Имя модуля" variant="outlined" placeholder="Введите новое имя"/>
        <SaveButtonsGroup show={saveBtnEnabled} save={saveNewName} />
      </Box>
    </>)
  }
}

function SaveButtonsGroup({ show, save }) {
  const { id } = useParams()

  if (show) return (<>
    <Box sx={{ display: "flex", justifyContent: "end", gap: 1 }}>
      <Button component={Link} to={`/module/${id}`} variant="contained" onClick={save}>Сохранить</Button>
      <Button component={Link} to={`/module/${id}`} variant="outlined">Отмена</Button>
    </Box>
  </>)
}