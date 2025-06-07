import { createSlice } from "@reduxjs/toolkit"
import { getModule, getId } from "./helpers"

export const modulesSlice =  createSlice({
	name: "modules",
	initialState: { modules: [] },
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