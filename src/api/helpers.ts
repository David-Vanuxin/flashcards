import { ModuleCreationParams } from "./types.js"

interface Term {
  answer: string
  question: string
}

export function parse(separator: string, text: string): Term[] {
  return text.split("\n").map(str => {
    const pair = str.split(separator)
    return { answer: pair[0], question: pair[1] }
  })
}

interface Module {
  name: string
  terms: Term[]
}

export function getModule({
  name,
  separator,
  text,
}: ModuleCreationParams): Module {
  return {
    name,
    terms: parse(separator, text),
  }
}
