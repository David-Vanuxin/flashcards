import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getModule } from "./helpers"

export const modulesApi = createApi({
  reducerPath: "modulesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${import.meta.env.VITE_API}/module/`,
  }),
  tagTypes: ["Module"],
  isJsonContentType: () => true,
  endpoints: builder => ({
    getAllModules: builder.query({
      query: () => "",
      providesTags: ["Module"],
    }),
    getModuleById: builder.query({
      query: id => id.toString(),
      providesTags: ["Module"],
      transformResponse: res => {
        // It's bad solution for making endless cards swipe (carousel)
        // See also ../Flashcards.jsx
        return {
          id: res.data.id,
          name: res.data.name,
          terms: res.data.terms.map((term, index, arr) => {
            let next = 0
            if (index + 1 < arr.length) next = index + 1
            let prev = index - 1
            if (index === 0) prev = arr.length - 1
            return { ...term, next, prev, hidden: false }
          }),
        }
      },
    }),
    createModule: builder.mutation({
      query: ({ name, separator, text }) => ({
        method: "post",
        body: getModule(name, separator, text),
      }),
      invalidatesTags: ["Module"],
    }),
    deleteModule: builder.mutation({
      query: id => ({
        method: "delete",
        url: id.toString(),
      }),
      invalidatesTags: ["Module"],
    }),
    renameModule: builder.mutation({
      query: ({ id, name }) => ({
        method: "put",
        url: id.toString(),
        body: { name },
      }),
      invalidatesTags: ["Module"],
    }),
    deleteTerms: builder.mutation({
      async queryFn({ deletedTerms }) {
        if (deletedTerms === 0) throw new Error("You can't delete 0 terms!")

        // Performing multiple requests
        const results = await Promise.all(
          deletedTerms.map(id =>
            fetch(`http://${import.meta.env.VITE_API}/term/${id}`, {
              method: "delete",
              headers: { "Content-Type": "application/json" },
            }),
          ),
        )

        return results
      },
      // cache updates manually (update even error)
      async onQueryStarted({ moduleId, deletedTerms }, { dispatch }) {
        /*const deleteTermUpdates = */ dispatch(
          modulesApi.util.updateQueryData("getModuleById", moduleId, mod => {
            mod.terms = mod.terms.filter(
              term => !deletedTerms.includes(term.id),
            )
          }),
        )
      },
      // this don't worked with queryFn
      // invalidatesTags: ['Module'],
    }),
    editTerm: builder.mutation({
      async queryFn(arg) {
        if (!arg.id) throw new Error("term.id is required")

        const term = Object.assign({}, arg)
        const termId = term.id
        delete term.id
        delete term.module

        const result = await fetch(
          `http://${import.meta.env.VITE_API}/term/${termId}`,
          {
            method: "put",
            body: JSON.stringify(term),
            headers: { "Content-Type": "application/json" },
          },
        )

        return result
      },
      async onQueryStarted(term, { dispatch, queryFulfilled }) {
        const update = dispatch(
          modulesApi.util.updateQueryData(
            "getModuleById",
            term.module.toString(),
            mod => {
              const termIndex = mod.terms.findIndex(t => t.id === term.id)
              return {
                ...mod,
                terms: [
                  ...mod.terms.slice(0, termIndex),
                  { ...mod.terms[termIndex], ...term },
                  ...mod.terms.slice(termIndex + 1),
                ],
              }
            },
          ),
        )

        try {
          await queryFulfilled()
        } catch {
          update.undo()
        }
      },
      invalidatesTags: ["Module"], // not worked without this, I don't not why
    }),
  }),
})

export const {
  useGetAllModulesQuery,
  useGetModuleByIdQuery,
  useCreateModuleMutation,
  useDeleteModuleMutation,
  useRenameModuleMutation,
  useDeleteTermsMutation,
  useEditTermMutation,
} = modulesApi
