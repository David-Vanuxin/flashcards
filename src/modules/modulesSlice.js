import { createSlice } from "@reduxjs/toolkit"
import {getModule, getId } from "./helpers"

export const modulesSlice =  createSlice({
	name: "modules",
	initialState: {
		modules: [
			{
				id: 0,
				name: "Test",
				terms: [
					{answer: "яблоко", question: "apple"},
					{answer: "апельсин", question: "orange"},
				]
			}
		]
	},
	reducers: {
		createModule: (state, action) => {
			const mod = getModule(action.payload.name, action.payload.separator, action.payload.text)
			mod.id = getId(state.modules)
			state.modules.push(mod)
		}
	}
})

export const { createModule } = modulesSlice.actions
export default modulesSlice.reducer