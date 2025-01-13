import { Outlet, Link } from "react-router";

export function Layout() {
	return (<>
		<nav>
			<Link to="/">Все карточки</Link>
			<Link to="/info">Справка</Link>
		</nav>
		<Outlet/>
	</>)
}