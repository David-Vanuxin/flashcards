import { createModule } from "./modulesSlice"
import { useDispatch } from "react-redux"
import { useState } from "react"

export default function CreateModule() {
	const dispatch = useDispatch()
	const [name, setName] = useState("")
	const [text, setText] = useState("")
	const [separator, setSeparator] = useState("")

	return (<>
		<h1>Создать новый модуль</h1>
		<div className="buttons-wrapper">
			<label>Имя модуля</label>
			<input onChange={event=>setName(event.target.value)} className="text-input"></input>
		</div>
		<div className="buttons-wrapper">
			<label>Разделитель</label>
			<input onChange={event=>setSeparator(event.target.value)} className="text-input" placeholder="Например: _"></input>
		</div>
		<p className="text">Перед добавлением убедитесь, что:</p>
		<ul className="text">
			<li>Все тройка "термин разделитель значение" имеют разделитель</li>
			<li>Каждая тройка начинается с новой строки</li>
		</ul>
		<textarea
			onChange={event=>setText(event.target.value)}
			className="text-area"
			placeholder="Образец: яблоко _ apple"
			spellCheck="false">
		</textarea>
		<div className="buttons-wrapper">
			<button className="main-page_button" onClick={() => dispatch(createModule({name, separator, text}))}>Сохранить</button>
			<button className="main-page_button">Отмена</button>
		</div>
	</>)
}