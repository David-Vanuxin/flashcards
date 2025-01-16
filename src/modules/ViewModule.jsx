import { Link } from "react-router";
import { deleteModule } from "./modulesSlice"
import { useDispatch } from "react-redux"

export default function ViewModule(props) {
	const dispatch = useDispatch()

	function onClickDelete() {
		dispatch(deleteModule(props.mod.id))
	}

	return (<>
		<table>
			<caption>
				<span>{props.mod.name}</span>
				<Link to={`flashcards/${props.mod.id}`}>Учить</Link>
				<button className="main-page_button" onClick={onClickDelete}>Удалить</button>
			</caption>
			<tbody>
				{
					props.mod.terms.map((term, i) => <Term term={term} key={i}/>)
				}
			</tbody>
		</table>
	</>)
}

function Term(props) {
	return (<>
		<tr>
			<td>{props.term.answer}</td>
			<td>{props.term.question}</td>
		</tr>
	</>)
}