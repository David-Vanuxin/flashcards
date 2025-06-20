import { useNavigate } from "react-router"
import { useGetAllModulesQuery } from "../api/modulesApi"

import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"

import CreateButton from "../widjets/CreateButton"

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <Box>
        <Typography sx={{ textAlign: "center" }} variant="h5">
          Все модули
        </Typography>
        <ListModules />
        <CreateButton action={() => navigate("/create")} />
      </Box>
    </>
  )
}

function ListModules() {
  const { data, error, isLoading } = useGetAllModulesQuery()

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
    if (data.length == 0)
      return (
        <>
          <Typography variant="body1">
            Чтобы создать модуль нажмите кнопку "+"
          </Typography>
        </>
      )

    return (
      <>
        <Table sx={{ border: "none" }} aria-label="collapsible table">
          <TableBody>
            {data.map(mod => (
              <ModuleName key={mod.id} mod={mod} />
            ))}
          </TableBody>
        </Table>
      </>
    )
  }
}
function ModuleName(props) {
  const navigate = useNavigate()
  return (
    <>
      <TableRow
        onClick={() => navigate(`/module/${props.mod.id}`)}
        sx={{ "& > *": { border: 0 } }}
      >
        <TableCell>{props.mod.name}</TableCell>
      </TableRow>
    </>
  )
}
