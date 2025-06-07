import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const modulesApi = createApi({
  reducerPath: 'modulesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://0.0.0.0:3000/module/' }),
  endpoints: builder => ({
    getAllModules: builder.query({
    	query: () => "",
    }),
    getModuleById: builder.query({
    	query: id => id.toString()
    }),
    createModule: builder.mutation({
      query: data => ({
        method: "post",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
      })
    })
  }),
})

export const { useGetAllModulesQuery, useGetModuleByIdQuery, useCreateModuleMutation } = modulesApi