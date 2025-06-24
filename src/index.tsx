import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import { Provider } from "react-redux"
import store from "./store"

import { Layout } from "./layout"

import Home from "./pages/Home"
import Flashcards from "./pages/Flashcards"
import CreateModule from "./pages/CreateModule"
import EditModule from "./pages/EditModule"
import ModuleInfo from "./pages/ModuleInfo"

import "@fontsource/roboto/400.css"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider, createTheme } from "@mui/material/styles"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

const root = createRoot(document.getElementById("app")!)
root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/create" element={<CreateModule />} />
              <Route path="/flashcards/:id" element={<Flashcards />} />
              <Route path="/module/:id" element={<ModuleInfo />} />
              <Route path="/module/:id/edit" element={<EditModule />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
)
