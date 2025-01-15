import { Link } from "react-router";

export default function ViewModule(props) {
	return (<>
		<table>
			<caption>
				<span>{props.mod.name}</span>
				<Link to={`flashcards/${props.mod.id}`}>Учить</Link>
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