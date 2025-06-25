import { useNavigate, useParams } from "react-router"

export function useIdParam() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) {
    navigate("/")
    return ""
  }

  return id
}
