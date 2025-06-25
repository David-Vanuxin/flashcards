import { useCreateModuleMutation } from "../api/modulesApi"
import { useState } from "react"
import { useNavigate } from "react-router"

import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"

import TermsListCreationForm from "../widjets/TermsListCreationForm"
import SaveButtonsGroup from "../widjets/SaveButtonsGroup"

export default function CreateModule() {
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [separator, setSeparator] = useState("")

  const [createModule] = useCreateModuleMutation()

  const navigate = useNavigate()

  function submit() {
    createModule({ name, separator, text })
    navigate("/")
  }

  function cancel() {
    navigate("/")
  }

  return (
    <>
      <Typography variant="h5">Создать новый модуль</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <TextField
          onChange={event => setName(event.target.value)}
          label="Имя модуля"
          variant="outlined"
          placeholder="Новый модуль"
        />
        <TextField
          onChange={event => setSeparator(event.target.value)}
          label="Разделитель"
          variant="outlined"
          placeholder="Например: _"
        />
      </Box>
      <Accordion sx={{ mt: 1, mb: 1 }}>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel-content"
          id="panel-header"
        >
          <Typography variant="body1">Правила ввода</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            Перед добавлением убедитесь, что:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Каждая пара начинается с новой строки" />
            </ListItem>
            <ListItem>
              <ListItemText primary="На каждой строке есть разделитель" />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      <TermsListCreationForm setText={setText} />
      <SaveButtonsGroup save={submit} cancel={cancel} />
    </>
  )
}
