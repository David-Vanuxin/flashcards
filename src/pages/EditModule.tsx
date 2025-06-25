import { useIdParam } from "../hooks"
import React, { useState, useEffect } from "react"
import {
  useGetModuleByIdQuery,
  useRenameModuleMutation,
  useDeleteTermsMutation,
  useEditTermMutation,
  useMoveTermsMutation,
  TransformedTerm,
} from "../api/modulesApi"

import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import ClearIcon from "@mui/icons-material/Clear"
import DoneIcon from "@mui/icons-material/Done"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"

import SaveButtonsGroup from "../widjets/SaveButtonsGroup"
import DeleteConfirmDialog from "../widjets/DeleteConfirmDialog"
import ListModules from "../widjets/ListModules"

export default function EditModule() {
  const id = useIdParam()
  const { data, isLoading } = useGetModuleByIdQuery(id)
  const [showSaveButtonsGroup, setShowSaveButtonsGroup] = useState(false)
  const [renameModule] = useRenameModuleMutation()
  const [newModuleName, setNewModuleName] = useState("Загрузка...")

  useEffect(() => {
    if (!isLoading && data) setNewModuleName(data.name)
  }, [isLoading])

  // These two handlers below uses no-null assertion
  // because they are drilled to props of components
  // thats rendered only if data isn't undefined
  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value !== data!.name) {
      setShowSaveButtonsGroup(true)
      setNewModuleName(event.target.value)
    } else {
      setShowSaveButtonsGroup(false)
      setNewModuleName("")
    }
  }

  function cancel() {
    setNewModuleName(data!.name)
    setShowSaveButtonsGroup(false)
  }

  function saveNewName() {
    if (newModuleName) {
      renameModule({ id, name: newModuleName })
      setShowSaveButtonsGroup(false)
    }
  }

  if (data) {
    return (
      <>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <TextField
            onChange={changeHandler}
            value={newModuleName}
            label="Имя модуля"
            variant="outlined"
            placeholder="Введите новое имя"
          />
          {showSaveButtonsGroup ? (
            <SaveButtonsGroup save={saveNewName} cancel={cancel} />
          ) : (
            ""
          )}
          <TermsList terms={data.terms} />
        </Box>
      </>
    )
  }
}

function TermsList({ terms }: { terms: TransformedTerm[] }) {
  const [selected, setSelected] = useState<number[]>([])
  const [generalCheckboxChecked, setGeneralCheckboxChecked] = useState(false)

  function selectAll() {
    setSelected([...terms.map(term => term.id)])
  }

  function removeAllSelected() {
    setSelected([])
  }

  function handleGeneralCheckboxChange() {
    setGeneralCheckboxChecked(checked => {
      if (!checked)
        selectAll() // current state value still false
      else removeAllSelected()

      return !checked
    })
  }

  useEffect(() => {
    if (selected.length === terms.length) setGeneralCheckboxChecked(true)
    else setGeneralCheckboxChecked(false)
  }, [selected])

  return (
    <>
      <Table sx={{ mb: 5 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                checked={generalCheckboxChecked}
                onChange={handleGeneralCheckboxChange}
                size="small"
              />
              Все
            </TableCell>
            <TableCell>Термин</TableCell>
            <TableCell>Значение</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {terms.map(t => (
            <Term
              selected={selected}
              setSelected={setSelected}
              term={t}
              key={t.id}
            />
          ))}
        </TableBody>
      </Table>
      <BottomMenu selected={selected} removeAllSelected={removeAllSelected} />
    </>
  )
}

interface TermProps {
  term: TransformedTerm
  selected: number[]
  setSelected: React.Dispatch<React.SetStateAction<number[]>>
}

function Term({
  term: { id, answer, question },
  selected,
  setSelected,
}: TermProps) {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (selected.includes(id)) setChecked(true)
    else setChecked(false)
  }, [selected])

  function addSelected() {
    setSelected(arr => {
      // throws error, but work
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
      if (!checked) addSelected()
      else removeSelection()

      return !checked
    })
  }

  return (
    <>
      <TableRow sx={{ "& > *": { border: 0 } }}>
        <TableCell>
          <Checkbox
            size="small"
            checked={checked}
            onChange={handleCheckboxChange}
          />
        </TableCell>
        <TableCell>
          <EditionGroup
            type="answer"
            termId={id}
            defaultValue={answer}
            label="Термин"
          />
        </TableCell>
        <TableCell>
          <EditionGroup
            type="question"
            termId={id}
            defaultValue={question}
            label="Значение"
          />
        </TableCell>
      </TableRow>
    </>
  )
}

interface EditionGroupProps {
  defaultValue: string
  label: string
  type: "answer" | "question"
  termId: number
}

function EditionGroup({
  defaultValue,
  label,
  type,
  termId,
}: EditionGroupProps) {
  const [buttonsVisibility, setButtonsVisibility] = useState(false)
  const [textValue, setTextValue] = useState(defaultValue)
  const id = useIdParam()
  const [editTerm, result] = useEditTermMutation()

  useEffect(() => {
    if (result.isError) console.error(result.error)
  }, [result])

  function saveChanges() {
    editTerm({
      id: termId,
      module: id,
      [type]: textValue,
    })
    setButtonsVisibility(false)
  }

  function changeHandler(event: React.ChangeEvent) {
    const newValue = (event.currentTarget as HTMLInputElement).value
    setTextValue(newValue)

    if (newValue !== defaultValue && newValue !== "") {
      setButtonsVisibility(true)
    } else setButtonsVisibility(false)
  }

  function cancel() {
    setTextValue(defaultValue)
    setButtonsVisibility(false)
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "right" }}>
        <TextField
          value={textValue}
          onChange={changeHandler}
          sx={{ width: "100%" }}
          size="small"
          label={label}
          variant="outlined"
        ></TextField>
        <EditionConfirmButtonsGroup
          confirm={saveChanges}
          cancel={cancel}
          show={buttonsVisibility}
        />
      </Box>
    </>
  )
}

function EditionConfirmButtonsGroup({
  show,
  confirm,
  cancel,
}: {
  show: boolean
  confirm: () => void
  cancel: () => void
}) {
  if (show)
    return (
      <>
        <Box
          sx={{
            position: "absolute",
            zIndex: 1000,
            mt: "2px",
            transform: "translateY(calc(100% + 6px))",
          }}
        >
          <Button
            sx={{ mr: "2px" }}
            onClick={confirm}
            variant="contained"
            size="small"
          >
            <DoneIcon fontSize="medium" />
          </Button>
          <Button onClick={cancel} variant="outlined" size="small">
            <ClearIcon fontSize="medium" />
          </Button>
        </Box>
      </>
    )
}

function BottomMenu({
  selected,
  removeAllSelected,
}: {
  selected: number[]
  removeAllSelected: () => void
}) {
  const [deleteTerms] = useDeleteTermsMutation()
  const [moveTerms] = useMoveTermsMutation()
  const id = useIdParam()
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false)
  const [openMoveConfirmDialog, setOpenMoveConfirmDialog] = useState(false)

  function handleClickDelete() {
    deleteTerms({ moduleId: id, deletedTerms: selected })
    setOpenDeleteConfirmDialog(false)
    removeAllSelected()
  }

  function handleClickMove(destinationId: string) {
    moveTerms({ terms: selected, destination: destinationId, source: id })
    setOpenMoveConfirmDialog(false)
    removeAllSelected()
  }

  if (selected.length !== 0)
    return (
      <>
        <AppBar position="fixed" sx={{ top: "auto", bottom: 0 }}>
          <Toolbar sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <Typography
              variant="button"
              gutterBottom
              sx={{ color: "text.primary", p: 1, m: 1 }}
            >
              Выбрано: {selected.length}
            </Typography>
            <Button onClick={() => setOpenMoveConfirmDialog(true)}>
              Переместить
            </Button>
            <Button onClick={() => setOpenDeleteConfirmDialog(true)}>
              Удалить
            </Button>
            <Button onClick={removeAllSelected} variant="outlined">
              Отменить
            </Button>
          </Toolbar>
        </AppBar>
        <DeleteConfirmDialog
          open={openDeleteConfirmDialog}
          text={`Вы действительно хотите удалить выбранные термины (${selected.length})?`}
          submit={handleClickDelete}
          cancel={() => setOpenDeleteConfirmDialog(false)}
        />
        <MoveConfirmDialog
          open={openMoveConfirmDialog}
          text={`Кликните на название модуля из списка ниже, чтобы переместить в него выбранные термины (${selected.length})`}
          submit={handleClickMove}
          cancel={() => setOpenMoveConfirmDialog(false)}
        />
      </>
    )
}

interface MoveConfirmDialogProps {
  open: boolean
  text: string
  submit: (id: string) => void
  cancel: () => void
}

function MoveConfirmDialog({
  open,
  text,
  submit,
  cancel,
}: MoveConfirmDialogProps) {
  return (
    <>
      <Dialog open={open}>
        <DialogTitle>Переместить термины</DialogTitle>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
          <ListModules action={submit} />
          <DialogActions>
            <Button onClick={cancel} variant="contained">
              Отмена
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  )
}
