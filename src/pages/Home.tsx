import { useNavigate } from "react-router"

import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

import CreateButton from "../widjets/CreateButton"
import ListModules from "../widjets/ListModules"

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <Box>
        <Typography sx={{ textAlign: "center" }} variant="h5">
          Все модули
        </Typography>
        <ListModules action={(id: string) => navigate(`/module/${id}`)} />
        <CreateButton action={() => navigate("/create")} />
      </Box>
    </>
  )
}
