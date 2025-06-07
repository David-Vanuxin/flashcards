import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { modulesApi } from "./modules/modulesApi"

export default configureStore({
	reducer: {
		[modulesApi.reducerPath]: modulesApi.reducer,
	},
  middleware: (getDefaultMiddleware) => 
  	getDefaultMiddleware().concat(modulesApi.middleware),
})