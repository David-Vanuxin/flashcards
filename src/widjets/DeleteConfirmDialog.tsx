import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import Button from "@mui/material/Button"

interface Props {
  open: boolean
  text: string
  submit: () => void
  cancel: () => void
}

export default function DeleteConfirmDialog({
  open,
  text,
  submit,
  cancel,
}: Props) {
  return (
    <>
      <Dialog open={open}>
        <DialogTitle>Подтвердите действие</DialogTitle>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
          <DialogActions>
            <Button onClick={submit} variant="outlined">
              Удалить
            </Button>
            <Button onClick={cancel} variant="contained">
              Отмена
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  )
}
