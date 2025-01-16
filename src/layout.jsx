import { Outlet, Link } from "react-router";
import DeleteModuleConfirm from "./modules/deleteModuleConfirm"

export function Layout() {
	return (<>
		<nav>
			<Link to="/">Все карточки</Link>
			<Link to="/info">Справка</Link>
		</nav>
		<Outlet/>
		<DeleteModuleConfirm/>
	</>)
}