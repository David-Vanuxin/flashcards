import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

interface Props {
  save: () => void
  cancel: () => void
}

export default function SaveButtonsGroup({ save, cancel }: Props) {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "end", gap: 1 }}>
        <Button variant="contained" onClick={save}>
          Сохранить
        </Button>
        <Button variant="outlined" onClick={cancel}>
          Отмена
        </Button>
      </Box>
    </>
  )
}
