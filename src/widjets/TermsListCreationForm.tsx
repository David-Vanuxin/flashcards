import TextField from "@mui/material/TextField"
import { SxProps } from "@mui/material"
import React from "react"

interface Props {
  setText: React.Dispatch<React.SetStateAction<string>>
  sx?: SxProps
}

export default function TermsListCreationForm({ setText, sx }: Props) {
  return (
    <>
      <TextField
        fullWidth
        onChange={event => setText(event.target.value)}
        label="Впишите сюда пары значений"
        placeholder="Образец: яблоко _ apple"
        multiline
        rows={6}
        sx={{ mb: 1, ...sx }}
      />
    </>
  )
}
