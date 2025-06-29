import React, { useEffect, useState } from "react"
import { useIdParam } from "../hooks"
import { useGetModuleByIdQuery, Term } from "../api/modulesApi"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import ClearIcon from "@mui/icons-material/Clear"

import "./flashcards.css"
import Paper from "@mui/material/Paper"
import { styled } from "@mui/material/styles"

type Status = "question" | "answer"

export default function Flashcards() {
  const id = useIdParam()
  const { data, error, isLoading } = useGetModuleByIdQuery(id)

  const [terms, setTerms] = useState<Term[]>([])
  const [number, setNumber] = useState(0)
  const [status, setStatus] = useState<Status>("question")

  const [lastAction, setLastAction] = useState<"inc" | "dec">("inc")

  useEffect(() => {
    if (!isLoading && data) setTerms(data.terms)
  }, [isLoading])

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key == "ArrowLeft") {
        prev()
      } else if (event.key == "ArrowRight") {
        next()
      } else if (event.keyCode == 13 || event.keyCode == 32) {
        deleteCard()
      } else if (event.key == "ArrowUp") {
        setStatus("answer")
      } else if (event.key == "ArrowDown") {
        setStatus("question")
      }
    }

    window.addEventListener("keydown", key)

    return () => {
      window.removeEventListener("keydown", key)
    }
  }, [number, terms])

  function next() {
    setNumber(n => (n === terms.length - 1 ? 0 : n + 1))
    setStatus("question")
    setLastAction("inc")
  }

  function prev() {
    setNumber(n => (n === 0 ? terms.length - 1 : n - 1))

    setStatus("question")
    setLastAction("dec")
  }

  function deleteCard() {
    if (terms.length === 1) return

    setTerms(terms => {
      const updated = [...terms]
      updated.splice(number, 1)

      if (lastAction === "inc") setNumber(n => (n === updated.length ? 0 : n))

      setStatus("question")
      return updated
    })

    if (lastAction !== "inc")
      // terms.length - 2 because terms being shorter after re-render
      // and terms.length - 1 became out of range
      setNumber(n => (n === 0 ? terms.length - 2 : n - 1))
  }

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

  if (terms.length === 0)
    return (
      <>
        <Typography variant="body1">Здесь ничего нет</Typography>
      </>
    )

  if (data && terms.length)
    return (
      <>
        <Typography sx={{ textAlign: "center" }} variant="h5">
          {data.name}
        </Typography>
        <Box
          sx={{
            height: "70vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            number={number}
            terms={terms}
            status={status}
            setStatus={setStatus}
          />
          <Box sx={{ mt: 2, display: "flex", gap: "2rem" }}>
            <IconButton onClick={deleteCard} size="large">
              <ClearIcon fontSize="inherit" />
            </IconButton>
            <IconButton onClick={prev} size="large">
              <ArrowBackIcon fontSize="inherit" />
            </IconButton>
            <IconButton onClick={next} size="large">
              <ArrowForwardIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Box>
      </>
    )
}

const CardPaper = styled(Paper)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  user-select: none;
`

interface CardsProps {
  number: number
  terms: Term[]
  status: Status
  setStatus: React.Dispatch<React.SetStateAction<Status>>
}

function Card({ number, terms, status, setStatus }: CardsProps) {
  const [cardWrapper, setCardWrapper] = useState("flip-card")
  const [cardInner, setCardInner] = useState("flip-card-inner")

  useEffect(() => {
    if (status == "question") {
      setCardWrapper("flip-card")
      setCardInner("flip-card-inner")
    } else {
      setCardWrapper("flip-card rotate")
      setCardInner("flip-card-inner rotate")
    }
  }, [status])

  function changeStatus() {
    if (status == "question") setStatus("answer")
    else if (status == "answer") setStatus("question")
  }

  return (
    <div onMouseDown={changeStatus} className={cardWrapper}>
      <div className={cardInner}>
        <div className="card">
          <CardPaper square={false} elevation={24}>
            <Typography variant="body1">{terms[number].answer}</Typography>
          </CardPaper>
        </div>
        <div className="flip-card-back card">
          {/*Without this checking you will see answer of next card when card rotate animation is playing*/}
          <CardPaper square={false} elevation={24}>
            <Typography variant="body1">
              {status == "answer" ? terms[number].question : ""}
            </Typography>
          </CardPaper>
        </div>
      </div>
    </div>
  )
}
