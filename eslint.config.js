import { defineConfig } from "eslint/config"
import globals from "globals"
import js from "@eslint/js"
import react from "eslint-plugin-react"

export default defineConfig([
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      js,
      react,
    },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
    },
  },
])
