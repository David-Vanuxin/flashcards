import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

export default function TermsListCreationForm({ submit, cancel, setText }) {
  return (
    <>
      <TextField
        fullWidth
        onChange={event => setText(event.target.value)}
        label="Впишите сюда пары значений"
        placeholder="Образец: яблоко _ apple"
        multiline
        rows={6}
      />
      <Box sx={{ mt: 1, display: "flex", justifyContent: "right", gap: 1 }}>
        <Button variant="contained" onClick={submit}>
          Сохранить
        </Button>
        <Button onClick={cancel} variant="outlined">
          Отмена
        </Button>
      </Box>
    </>
  )
}
