import { createSlice } from "@reduxjs/toolkit"
import {getModule, getId } from "./helpers"

export const modulesSlice =  createSlice({
	name: "modules",
	initialState: {
		modules: [
			{
				id: 0,
				name: "Test000",
				terms: [
					{answer: "яблоко", question: "apple"},
					{answer: "апельсин", question: "orange"},
				]
			},
			{
				id: 1,
				name: "Test1111",
				terms: [
					{answer: "1+2", question: "3"},
					{answer: "3 ** 3", question: "27"},
				]
			},
			{
				id: 2,
				name: "Test222222",
				terms: [
					{answer: "aaaa", question: "bbbb"},
					{answer: "cccc", question: "dddd"},
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
			const id = action.payload
			state.modules = [...state.modules.filter(mod => mod.id != id)]
		}
	}
})

export const { createModule, deleteModule } = modulesSlice.actions
export default modulesSlice.reducer