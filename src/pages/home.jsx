import { Link } from "react-router";
import ViewModule from "../modules/ViewModule"
import { useSelector } from "react-redux"

export function Home() {
	const modules = useSelector(state => state.modules.modules)
	return (<>
		<h1>Все модули</h1>
		<Link to="/create">Создать</Link>
		<div>
			{
				modules.map((mod, i) => (<ViewModule key={i + 1000} mod={mod}/>))
			}
		</div>
	</>)
}