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
    	query: id => id.toString(),
      transformResponse: res => {
        // It's bad solution for making endless cards swipe (carousel) 
        // See also ../Flashcards.jsx
        return {
          name: res.data.name,
          terms: res.data.terms.map((term, index, arr) => {
            let next = 0
            if (index + 1 < arr.length) next = index + 1
            let prev = index - 1
            if (index === 0) prev = arr.length - 1
            return {...term, next, prev, hidden: false}
          })
        }
      }
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