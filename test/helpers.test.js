import test from "node:test"
import assert from "node:assert/strict"
import { parse, getModule } from "../src/api/helpers.js"

const terms = [
  { question: "a", answer: "1" },
  { question: "b", answer: "2" },
]

const name = "Test module"
const separator = "-"
const text = "1-a\n2-b"

test("Parsing test", () => {
  const result = parse(separator, text)
  assert.deepEqual(result, terms)
})

test("Module object creation test", () => {
  const result = getModule(name, separator, text)
  assert.deepEqual(result, { name, terms })
})
