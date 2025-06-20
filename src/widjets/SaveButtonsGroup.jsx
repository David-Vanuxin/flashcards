import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

export default function SaveButtonsGroup({ save, cancel }) {
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
