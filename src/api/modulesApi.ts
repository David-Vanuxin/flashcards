import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getModule, ModuleCreationParams } from "./helpers.js"

export interface Module {
  id: number
  name: string
  terms: Term[]
}

export interface Term {
  id: number
  answer: string
  question: string
}

interface ApiCreationResponse {
  id: {
    id: string
  }
}

interface ApiResponse {
  status: "success" | "error"
}

interface ApiDeleteResponse extends ApiResponse {
  message: string
}

interface RenameModuleParams {
  id: string
  name: string
}

interface ApiRenameResponse extends ApiResponse, RenameModuleParams {}

interface EditTermArgs {
  id: number
  module: string
  answer?: string
  question?: string
}

interface NewTermsAdditionParams {
  moduleId: string
  text: string
  separator: string
}

interface MoveTermsParams {
  terms: number[]
  destination: number | string
  source: number | string
}

export const modulesApi = createApi({
  reducerPath: "modulesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${import.meta.env.VITE_API}/module/`,
    isJsonContentType: () => true,
  }),
  tagTypes: ["Module"],
  endpoints: builder => ({
    getAllModules: builder.query({
      query: () => "",
      providesTags: ["Module"],
    }),
    getModuleById: builder.query<Module, string>({
      query: id => id,
      providesTags: ["Module"],
      transformResponse: (res: { data: Module }): Module => {
        return { ...res.data }
      },
    }),
    createModule: builder.mutation<ApiCreationResponse, ModuleCreationParams>({
      query: ({ name, separator, text }) => ({
        url: "",
        method: "post",
        body: getModule({ name, separator, text }),
      }),
      invalidatesTags: ["Module"],
    }),
    deleteModule: builder.mutation<ApiDeleteResponse, string>({
      query: id => ({
        method: "delete",
        url: id,
      }),
      invalidatesTags: ["Module"],
    }),
    renameModule: builder.mutation<ApiRenameResponse, RenameModuleParams>({
      query: ({ id, name }) => ({
        method: "put",
        url: id.toString(),
        body: { name },
      }),
      invalidatesTags: ["Module"],
    }),
    deleteTerms: builder.mutation<
      Response[],
      { deletedTerms: number[]; moduleId: string }
    >({
      async queryFn({ deletedTerms }) {
        if (deletedTerms.length === 0)
          throw new Error("You can't delete 0 terms!")

        const results = await Promise.all(
          deletedTerms.map(id =>
            fetch(`http://${import.meta.env.VITE_API}/term/${id}`, {
              method: "delete",
              headers: { "Content-Type": "application/json" },
            }),
          ),
        )

        return { data: results }
      },
      // Cache updates manually, because
      // re-fetch all module is no needed if one term has been deleted
      async onQueryStarted({ moduleId, deletedTerms }, { dispatch }) {
        dispatch(
          modulesApi.util.updateQueryData("getModuleById", moduleId, mod => {
            mod.terms = mod.terms.filter(
              term => !deletedTerms.includes(term.id),
            )
          }),
        )
      },
    }),
    editTerm: builder.mutation<void, EditTermArgs>({
      //eslint-disable-next-line
      async queryFn(term, _api, _extraOptions, baseQuery) {
        if (!term.id) throw new Error("term.id is required")

        await fetch(`http://${import.meta.env.VITE_API}/term/${term.id}`, {
          method: "put",
          body: JSON.stringify(term),
          headers: { "Content-Type": "application/json" },
        })
        return { data: undefined }
      },
      async onQueryStarted(term, { dispatch }) {
        dispatch(
          modulesApi.util.updateQueryData(
            "getModuleById",
            term.module.toString(),
            (mod: Module) => {
              const editedTermIndex = mod.terms.findIndex(t => t.id === term.id)
              mod.terms[editedTermIndex] = {
                ...mod.terms[editedTermIndex],
                ...term,
              }
            },
          ),
        )
      },
    }),
    addNewTerms: builder.mutation<Response[], NewTermsAdditionParams>({
      async queryFn({ moduleId, text, separator }) {
        const { terms } = getModule({ name: "UNUSED_STRING", separator, text })

        const results = await Promise.all(
          terms.map(term =>
            fetch(`http://${import.meta.env.VITE_API}/term/`, {
              method: "post",
              body: JSON.stringify({ ...term, module: moduleId }),
              headers: { "Content-Type": "application/json" },
            }),
          ),
        )
        return { data: results }
      },
      // I use auto re-fetch here, because
      // I have to know term.id, thats returns by server, before adding term to terms list
      invalidatesTags: ["Module"],
    }),
    moveTerms: builder.mutation<Response[], MoveTermsParams>({
      async queryFn({ terms, destination }) {
        const results = await Promise.all(
          terms.map(id =>
            fetch(`http://${import.meta.env.VITE_API}/term/${id}`, {
              method: "put",
              body: JSON.stringify({ module: destination }),
              headers: { "Content-Type": "application/json" },
            }),
          ),
        )
        return { data: results }
      },
      async onQueryStarted({ terms, destination, source }, { dispatch }) {
        // destination passed from cache or request json (it's number)
        // source passed from useParams (it's string)
        // so === not worked here
        if (destination == source) return

        dispatch(
          modulesApi.util.updateQueryData(
            "getModuleById",
            source.toString(),
            (mod: Module) => {
              const moved = mod.terms.filter(term => terms.includes(term.id))
              mod.terms = mod.terms.filter(term => !terms.includes(term.id))

              dispatch(
                modulesApi.util.updateQueryData(
                  "getModuleById",
                  destination.toString(),
                  (mod: Module) => {
                    mod.terms = [...mod.terms, ...moved]
                  },
                ),
              )
            },
          ),
        )
      },
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
  useAddNewTermsMutation,
  useMoveTermsMutation,
} = modulesApi
