import { Link } from "react-router";

export function Home() {
	return (<>
		<h1>Все карточки</h1>
		<Link to="/create">Создать</Link>
		<div>
			<table>
				<caption>
					<span>Fruits</span>
					<Link to="cards/1">Учить</Link>
				</caption>
				<tbody>
					<tr>
						<td>яблоко</td>
						<td>apple</td>
					</tr>
					<tr>
						<td>апельсин</td>
						<td>orange</td>
					</tr>
				</tbody>
			</table>
			<table>
				<caption>
					<span>Формулы</span>
					<Link to="cards/2">Учить</Link>
				</caption>
				<tbody>
					<tr>
						<td>Периметр</td>
						<td>2(a + b)</td>
					</tr>
					<tr>
						<td>Площадь</td>
						<td>S = a * b</td>
					</tr>
				</tbody>
			</table>
		</div>
	</>)
}