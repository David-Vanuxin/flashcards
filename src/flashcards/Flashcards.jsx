import { useEffect, useState } from "react"
// import { useSelector } from "react-redux"
import { useParams } from "react-router";
import { useGetModuleByIdQuery } from "../modules/modulesApi"
import Typography from '@mui/material/Typography';

import "./cards.css"

export function Flashcards() {
	const { id } = useParams()
  const { data, error, isLoading } = useGetModuleByIdQuery(id)

  const [terms, setTerms] = useState([])
  const [number, setNumber] = useState(0)
  const [status, setStatus] = useState("question")

  const [lastAction, setLastAction] = useState("inc")

  useEffect(() => {
    if (!isLoading) {
      setTerms(data.map((term, index, arr) => {
        let next = 0
        if (index + 1 < arr.length) next = index + 1
        let prev = index - 1
        if (index === 0) prev = arr.length - 1
        return {...term, next, prev, hidden: false}
      }))
    }
  }, [isLoading])

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

  }, [number])

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
    terms[cardNumber].hidden = true
    setTerms([...terms])
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

  if (data.length !== 0) return (<div className="cards-wrapper">
    <Card number={number} setNumber={setNumber} terms={terms} status={status} setStatus={setStatus}/>
    <div className="buttons">
      <button className="button delete" onClick={() => deleteCard(number)}>✕</button>
      <button onClick={prev} className="button arrow">&#8592;</button>
      <button onClick={next} className="button arrow">&#8594;</button>
    </div>
  </div>)
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