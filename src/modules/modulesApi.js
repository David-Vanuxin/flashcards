import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getModule } from "./helpers"

export const modulesApi = createApi({
  reducerPath: 'modulesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://0.0.0.0:3000/module/' }),
  tagTypes: ['Module'],
  endpoints: builder => ({
    getAllModules: builder.query({
    	query: () => "",
      providesTags: ['Module'],
    }),
    getModuleById: builder.query({
    	query: id => id.toString()
    }),
    createModule: builder.mutation({
      query: ({name, separator, text}) => ({
        method: "post",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify(getModule(name, separator, text))
      }),
      invalidatesTags: ['Module'],
    }),
    deleteModule: builder.mutation({
      query: id => ({
        method: "delete",
        url: id.toString(),
        headers: {
          "Content-Type":"application/json"
        }
      }),
      invalidatesTags: ['Module'],
    })
  }),
})

export const { useGetAllModulesQuery, useGetModuleByIdQuery, useCreateModuleMutation, useDeleteModuleMutation } = modulesApi