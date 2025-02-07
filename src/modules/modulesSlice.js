import { createSlice } from "@reduxjs/toolkit"
import {getModule, getId } from "./helpers"

export const modulesSlice =  createSlice({
	name: "modules",
	initialState: {
		modules: [
			{
				id: 0,
				name: "Example",
				terms: [
					{answer: "яблоко", question: "apple"},
					{answer: "апельсин", question: "orange"},
					{answer: "2 + 2", question: "4"},
				]
			}
		]
	},
	reducers: {
		createModule: (state, action) => {
			const mod = getModule(action.payload.name, action.payload.separator, action.payload.text)
			mod.id = getId(state.modules)
			state.modules.push(mod)
		},

		deleteModule: (state, action) => {
			state.modules = [...state.modules.filter(mod => mod.id != action.payload)]
		},
	}
})

export const { createModule, deleteModule } = modulesSlice.actions
export default modulesSlice.reducer