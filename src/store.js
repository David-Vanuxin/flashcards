import { configureStore } from "@reduxjs/toolkit"
import modulesReducer from "./modules/modulesSlice"
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { modulesApi } from "./modules/modulesApi"

export default configureStore({
	reducer: {
		modules: modulesReducer,
		[modulesApi.reducerPath]: modulesApi.reducer,
	},
  middleware: (getDefaultMiddleware) => 
  	getDefaultMiddleware().concat(modulesApi.middleware),
})