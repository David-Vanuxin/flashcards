import { configureStore } from "@reduxjs/toolkit"
import modulesReducer from "./modules/modulesSlice"

export default configureStore({
	reducer: {
		modules: modulesReducer
	}
})