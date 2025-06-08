import React from "react"
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux"
import store from "./store"

import { Layout } from "./layout"
import { Home } from "./pages/home"

import { Flashcards } from "./flashcards/Flashcards"
import CreateModule from "./modules/CreateModule"

import '@fontsource/roboto/400.css';

const root = createRoot(document.getElementById('app'));
root.render(
	<React.StrictMode>
	<Provider store={store}>
	<BrowserRouter>
	<Routes>
	<Route element={<Layout />}>
		<Route index element={<Home/>}/>
		<Route path="/create" element={<CreateModule/>}/>
		<Route path="/flashcards/:id" element={<Flashcards/>}/>
	</Route>
	</Routes>
	</BrowserRouter>
	</Provider>
	</React.StrictMode>);