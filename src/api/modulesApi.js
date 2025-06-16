import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getModule } from "./helpers"

export const modulesApi = createApi({
  reducerPath: 'modulesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://0.0.0.0:3000/module/' }),
  tagTypes: ['Module'],
  isJsonContentType: (headers) => true, 
  endpoints: builder => ({
    getAllModules: builder.query({
    	query: () => "",
      providesTags: ['Module'],
    }),
    getModuleById: builder.query({
    	query: id => id.toString(),
      providesTags: ['Module'],
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
        body: getModule(name, separator, text)
      }),
      invalidatesTags: ['Module'],
    }),
    deleteModule: builder.mutation({
      query: id => ({
        method: "delete",
        url: id.toString(),
      }),
      invalidatesTags: ['Module'],
    }),
    renameModule: builder.mutation({
      query: ({id, name}) => ({
        method: "put",
        url: id.toString(),
        body: { name }
      }),
      invalidatesTags: ['Module'],
    }),
    deleteTerms: builder.mutation({
      async queryFn({ moduleId, deletedTerms }, api, extraOptions, baseQuery) {
        if (deletedTerms === 0) throw new Error("You can't delete 0 terms!")

        // Performing multiple requests
        const results = await Promise.all(deletedTerms.map(id => fetch(`http://0.0.0.0:3000/term/${id}`, {
          method: "delete",
          headers: {"Content-Type":"application/json"},
        })))
      },
      // cache updates manually (optimistic update)
      async onQueryStarted({ moduleId, deletedTerms }, { dispatch, queryFulfilled }) {
        const deleteTermUpdates = dispatch(modulesApi.util.updateQueryData('getModuleById', moduleId, mod => {
          mod.terms = mod.terms.filter(term => !deletedTerms.includes(term.id))
        }))
      }
      // this don't worked with queryFn 
      // invalidatesTags: ['Module'],
    })
  }),
})

export const { useGetAllModulesQuery, useGetModuleByIdQuery, useCreateModuleMutation, useDeleteModuleMutation, useRenameModuleMutation, useDeleteTermsMutation } = modulesApi