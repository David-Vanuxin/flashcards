import TextField from "@mui/material/TextField"

export default function TermsListCreationForm({ setText }) {
  return (
    <>
      <TextField
        fullWidth
        onChange={event => setText(event.target.value)}
        label="Впишите сюда пары значений"
        placeholder="Образец: яблоко _ apple"
        multiline
        rows={6}
        sx={{ mb: 1 }}
      />
    </>
  )
}
