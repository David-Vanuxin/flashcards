import { useEffect, useState } from "react"
import { useParams } from "react-router";
import { useGetModuleByIdQuery } from "../modules/modulesApi"
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ClearIcon from '@mui/icons-material/Clear';

import "./flashcards.css"

export default function Flashcards() {
	const { id } = useParams()
  const { data, error, isLoading } = useGetModuleByIdQuery(id)

  const [terms, setTerms] = useState([])
  const [number, setNumber] = useState(0)
  const [status, setStatus] = useState("question")

  const [lastAction, setLastAction] = useState("inc")

  useEffect(() => { if (!isLoading) setTerms(data.terms) }, [isLoading])

  useEffect(() => {
    const key = event => {
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

  function next() {
    let nextTermIndex = terms[number].next
    while(terms[nextTermIndex].hidden)
      nextTermIndex = terms[nextTermIndex].next
    setNumber(nextTermIndex)
    setLastAction("inc")
    setStatus("question")
  }

  function prev() {
    let nextTermIndex = terms[number].prev
    while(terms[nextTermIndex].hidden) 
      nextTermIndex = terms[nextTermIndex].prev
    setNumber(nextTermIndex)
    setLastAction("dec")
    setStatus("question")
  }

  function deleteCard(cardNumber) {
    if (terms.reduce((count, term) => !term.hidden ? count++ : count, 0) === 1)
      return

    setTerms([...terms.filter((term, i) => {
      if (i !== cardNumber) return term
    }), {...terms[cardNumber], hidden: true}])
    
    if (lastAction == "inc") {
      next()
    } else if (lastAction == "dec") {
      prev()
    }
  }

  if (error) return (<>
    <Typography variant="body1">Что-то пошло не так((</Typography>
  </>)

  if (isLoading) return (<>
    <Typography variant="body1">Загрузка...</Typography>
  </>)

  if (terms.length === 0) return (<>
    <Typography variant="body1">Здесь ничего нет</Typography>
  </>)

  if (data.length !== 0) return (<>
    <Typography sx={{ textAlign: "center" }} variant="h5">{data.name}</Typography>
    <Box sx={{ height: "70vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Card sx={{ mt: 4 }} number={number} setNumber={setNumber} terms={terms} status={status} setStatus={setStatus}/>
      <Box sx={{ mt: 2, display: "flex", gap: "2rem" }}>
        <IconButton onClick={() => deleteCard(number)} size="large">
          <ClearIcon fontSize="inherit"/>
        </IconButton>
        <IconButton onClick={prev} size="large">
          <ArrowBackIcon fontSize="inherit"/>
        </IconButton>
        <IconButton onClick={next} size="large">
          <ArrowForwardIcon fontSize="inherit"/>
        </IconButton>
      </Box>
    </Box>
  </>)
}

function Card(props) {
  const {number, setNumber, terms, status, setStatus} = props

  const [cardWrapper, setCardWrapper] = useState("flip-card")
  const [cardInner, setCardInner] = useState("flip-card-inner")

  useEffect(() => {
    if (status == "question") {
      setCardWrapper("flip-card")
      setCardInner("flip-card-inner")
    } else {
      setCardWrapper("flip-card rotate-animate")
      setCardInner("flip-card-inner rotate-animate")
    }
  }, [status])


  function changeStatus() {
    if (status == "question") setStatus("answer")
    else if (status == "answer") setStatus("question")
  }

  return (<div onMouseDown={changeStatus} className={cardWrapper}>
    <div className={cardInner}>
      <div className="flip-card-front card">
        <div style={{padding: "1rem"}}>{terms[number].answer}</div>
      </div>
      <div className="flip-card-back card">
        {/*Without this checking you will see answer of next card when card rotate animation is playing*/}
        <div style={{padding: "1rem"}}>{status == "answer" ? terms[number].question : ""}</div>
      </div>
    </div>
  </div>)
}