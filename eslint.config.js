import { defineConfig } from "eslint/config"
import globals from "globals"
import js from "@eslint/js"
import react from "eslint-plugin-react"
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default defineConfig([
  {
    languageOptions: {
      parser: tsParser,
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
      "@typescript-eslint": tsPlugin,
    },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
      ...js.configs.recommended.rules,
      ...tsPlugin.configs["recommended"].rules,
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
])
