import { Link, useParams, useNavigate } from "react-router"
import { useState } from "react"
import {
  useGetModuleByIdQuery,
  useDeleteModuleMutation,
  useAddNewTermsMutation,
} from "../api/modulesApi"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward"
import EditIcon from "@mui/icons-material/Edit"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TextField from "@mui/material/TextField"

import CreateButton from "../widjets/CreateButton"
import TermsListCreationForm from "../widjets/TermsListCreationForm"
import SaveButtonsGroup from "../widjets/SaveButtonsGroup"

export default function ModuleInfo() {
  const { id } = useParams()
  const { data, error, isLoading } = useGetModuleByIdQuery(id)
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false)
  const navigate = useNavigate()
  const [openAddTermsDialog, setOpenAddTermsDialog] = useState(false)

  function showAddTermsDialog() {
    setOpenAddTermsDialog(true)
  }

  if (error)
    return (
      <>
        <Typography variant="body1">Что-то пошло не так((</Typography>
      </>
    )

  if (isLoading)
    return (
      <>
        <Typography variant="body1">Загрузка...</Typography>
      </>
    )

  if (data) {
    return (
      <>
        <Typography sx={{ textAlign: "center" }} variant="h5">
          {data.name}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton size="large" component={Link} to={`/flashcards/${id}`}>
            <ArrowOutwardIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            size="large"
            onClick={() => navigate(`/module/${id}/edit`)}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            size="large"
            onClick={() => setOpenDeleteConfirmDialog(true)}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <TermsList terms={data.terms} />
        <CreateButton action={showAddTermsDialog} />
        <AddTermsDialog
          openDialog={openAddTermsDialog}
          setOpenDialog={setOpenAddTermsDialog}
        />
        <DeleteConfirm
          id={id}
          name={data.name}
          openDialog={openDeleteConfirmDialog}
          setOpenDialog={setOpenDeleteConfirmDialog}
        />
      </>
    )
  }
}

function TermsList({ terms }) {
  if (terms.length === 0)
    return (
      <>
        <Typography variant="body1">Модуль пуст</Typography>
      </>
    )
  else
    return (
      <>
        <Table sx={{ border: "none" }} aria-label="collapsible table">
          <TableBody>
            {terms.map(t => (
              <Term term={t} key={t.id} />
            ))}
          </TableBody>
        </Table>
      </>
    )
}

function DeleteConfirm(props) {
  const navigate = useNavigate()
  const [deleteModule] = useDeleteModuleMutation()

  function onClickDelete() {
    deleteModule(props.id)
    props.setOpenDialog(false)
    navigate("/")
  }

  return (
    <>
      <Dialog open={props.openDialog}>
        <DialogTitle>Подтвердите действие</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Удалить модуль <span>{props.name}</span>?
          </DialogContentText>
          <DialogActions>
            <Button onClick={onClickDelete} variant="outlined">
              Удалить
            </Button>
            <Button
              onClick={() => props.setOpenDialog(false)}
              variant="contained"
            >
              Отмена
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  )
}

function AddTermsDialog({ setOpenDialog, openDialog }) {
  const { id } = useParams()
  const [text, setText] = useState("")
  const [separator, setSeparator] = useState("")

  const [addNewTerms] = useAddNewTermsMutation()

  return (
    <>
      <Dialog open={openDialog}>
        <DialogTitle sx={{ pb: 0 }}>Добавить термины</DialogTitle>
        <DialogContent sx={{ width: "80vw" }}>
          <TextField
            sx={{ mt: 1 }}
            onChange={event => setSeparator(event.target.value)}
            label="Разделитель"
            variant="outlined"
            placeholder="Например: _"
          />
          <TermsListCreationForm sx={{ mt: 1 }} setText={setText} />
          <DialogActions>
            <SaveButtonsGroup
              save={() => {
                addNewTerms({ moduleId: id, text, separator })
                setOpenDialog(false)
              }}
              cancel={() => setOpenDialog(false)}
            />
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  )
}

function Term(props) {
  return (
    <>
      <TableRow sx={{ "& > *": { border: 0 } }}>
        <TableCell>{props.term.answer}</TableCell>
        <TableCell>{props.term.question}</TableCell>
      </TableRow>
    </>
  )
}
