// for future
//import { useParams } from "react-router";
import { useEffect, useState } from "react"

// TODO: style must be common for entire app
import "./cards.css"

// TODO: load from store
const data = [
	{
		"question":"orange",
		"answer":"апельсин"
	},
	{
		"question":"apple",
		"answer":"яблоко"
	},
]

export function Flashcards() {
	// for future
	//const params = useParams()

  const [terms, setTerms] = useState([])
  const [received, setReceived] = useState(false)
  const [number, setNumber] = useState(0)
  const [status, setStatus] = useState("question")
  const [deleted, setDeleted] = useState([])

  const [lastAction, setLastAction] = useState("inc")

  useEffect(() => {
    const key = event => {
      if (event.key == "ArrowLeft") {
        decrementNumber(setNumber)
      } else if (event.key == "ArrowRight") {
        incrementNumber(setNumber)
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

  useEffect(() => {
    if (!received) {
      setTerms(data)
      setReceived(true)
    }
  }, [])

  function incrementNumber(ff) {
    let newNumber;
    if (number == data.length - 1) {
      newNumber = 0
    } else {
      newNumber = number + 1
    }
    if (deleted.findIndex((element) => element == newNumber) == -1) {
      ff(newNumber)
    } else {
      let find = false
      let n = newNumber
      while (!find) {
        if (n == data.length - 1) {
          n = 0
        }
        if (deleted.findIndex((element) => element == n) == -1) {
          ff(n)
          break
        } else {
          if (n != newNumber) n++
          else break
        }
      }
    }

    setLastAction("inc")
    setStatus("question")
  }

  function decrementNumber(ff) {
    let newNumber;
    if (number == 0) {
      newNumber = data.length - 1
    } else {
      newNumber = number - 1
    }

    if (deleted.findIndex((element) => element == newNumber) == -1) {
      ff(newNumber)
    } else {
      let find = false
      let n = newNumber
      while (!find) {
        if (n == -1) {
          n = data.length - 1
        }
        if (deleted.findIndex((element) => element == n) == -1) {
          ff(n)
          break
        } else {
          if (n != newNumber) n--
          else break
        }
      }
    }

    setLastAction("dec")
    setStatus("question")
  }

  function deleteCard(cardNumber) {
    setDeleted([...deleted, cardNumber])
    if (lastAction == "inc") {
      incrementNumber(setNumber)
    } else if (lastAction == "dec") {
      decrementNumber(setNumber)
    }
  }
  function reset() {
    setDeleted([])
    setNumber(0)
    setStatus("question")
  }

  if (!received) return (<h1>Загрузка...</h1>)
  else if (received) return (
    <div className="cards-wrapper">
      <Card deleted={deleted} number={number} setNumber={setNumber} terms={terms} status={status} setStatus={setStatus}/>
      <div className="buttons">
        <button className="button delete" onClick={() => deleteCard(number)}>✕</button>
        <button onClick={() => decrementNumber(setNumber)} className="button arrow">&#8592;</button>
        <button onClick={() => incrementNumber(setNumber)} className="button arrow">&#8594;</button>
      </div>
    </div>
  )
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