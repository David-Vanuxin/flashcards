import React, { useEffect, useState } from "react"
import { useIdParam } from "../hooks"
import { useGetModuleByIdQuery, TransformedTerm } from "../api/modulesApi"
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

  const [terms, setTerms] = useState<TransformedTerm[]>([])
  const [number, setNumber] = useState(0)
  const [status, setStatus] = useState<Status>("question")

  const [lastAction, setLastAction] = useState("inc")

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
        deleteCard(number)
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

  // This algorithm provide hign load to CPU
  // For see it just do this:
  // 1) Open task manager
  // 2) Hide many cards
  // 3) Click to arrows
  function next() {
    let nextTermIndex = terms[number].next
    while (terms[nextTermIndex].hidden)
      nextTermIndex = terms[nextTermIndex].next
    setNumber(nextTermIndex)
    setLastAction("inc")
    setStatus("question")
  }

  function prev() {
    let nextTermIndex = terms[number].prev
    while (terms[nextTermIndex].hidden)
      nextTermIndex = terms[nextTermIndex].prev
    setNumber(nextTermIndex)
    setLastAction("dec")
    setStatus("question")
  }

  function deleteCard(cardNumber: number) {
    // Important! count + 1, not count++
    // arrow funtction returns variable "count",
    // thats increment in this case useless
    if (
      terms.reduce((count, term) => (!term.hidden ? count + 1 : count), 0) === 1
    )
      return

    const newTerms = terms.map(t => Object.assign({}, t))
    newTerms[cardNumber].hidden = true

    setTerms(newTerms)

    if (lastAction == "inc") {
      next()
    } else if (lastAction == "dec") {
      prev()
    }
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

  if (data)
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
            // sx={{ mt: 4 }}
            number={number}
            terms={terms}
            status={status}
            setStatus={setStatus}
          />
          <Box sx={{ mt: 2, display: "flex", gap: "2rem" }}>
            <IconButton onClick={() => deleteCard(number)} size="large">
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
  terms: TransformedTerm[]
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
