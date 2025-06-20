import TextField from "@mui/material/TextField"
import SaveButtonsGroup from "./SaveButtonsGroup"

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
        sx={{ mb: 1 }}
      />
      <SaveButtonsGroup save={submit} cancel={cancel} />
    </>
  )
}
