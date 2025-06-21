import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import Typography from "@mui/material/Typography"

import { useGetAllModulesQuery } from "../api/modulesApi"

export default function ListModules({ action }) {
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
              <ModuleName
                key={mod.id}
                name={mod.name}
                onClick={() => action(mod.id)}
              />
            ))}
          </TableBody>
        </Table>
      </>
    )
  }
}

function ModuleName({ onClick, name }) {
  return (
    <>
      <TableRow onClick={onClick} sx={{ "& > *": { border: 0 } }}>
        <TableCell>{name}</TableCell>
      </TableRow>
    </>
  )
}
