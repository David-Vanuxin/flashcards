import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import { Layout } from "./layout"
import { Home } from "./pages/home"
import { Cards } from "./pages/cards"
import { Info } from "./pages/info"
import { CreateCards } from "./pages/create"

const root = createRoot(document.getElementById('app'));
root.render(
	<BrowserRouter>
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<Home/>}/>
				<Route path="/create" element={<CreateCards/>}/>
				<Route path="/info" element={<Info/>}/>
				<Route path="/cards/:id" element={<Cards/>}/>
			</Route>
		</Routes>
	</BrowserRouter>);