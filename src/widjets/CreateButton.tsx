import Fab from "@mui/material/Fab"
import Box from "@mui/material/Box"
import AddIcon from "@mui/icons-material/Add"

export default function CreateButton({ action }: { action: () => void }) {
  return (
    <>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Fab onClick={action} size="medium" color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Box>
    </>
  )
}
