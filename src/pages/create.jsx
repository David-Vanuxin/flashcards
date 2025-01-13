export function CreateCards() {
	return (<>
		<h1>Создать новый модуль</h1>
		<div className="buttons-wrapper">
			<label>Имя модуля</label>
			<input className="text-input"></input>
		</div>
		<div className="buttons-wrapper">
			<label>Разделитель</label>
			<input className="text-input" placeholder="Например: _"></input>
		</div>
		<p className="text">Перед добавлением убедитесь, что:</p>
		<ul className="text">
			<li>Все тройка "термин разделитель значение" имеют разделитель</li>
			<li>Каждая тройка начинается с новой строки</li>
		</ul>
		<textarea
			className="text-area"
			placeholder="Образец: яблоко _ apple"
			spellCheck="false">
		</textarea>
		<div className="buttons-wrapper">
			<button className="main-page_button">Сохранить</button>
			<button className="main-page_button">Отмена</button>
		</div>
	</>)
}