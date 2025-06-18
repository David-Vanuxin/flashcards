import { configureStore } from "@reduxjs/toolkit"
import { modulesApi } from "./api/modulesApi"

export default configureStore({
  reducer: {
    [modulesApi.reducerPath]: modulesApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(modulesApi.middleware),
})
