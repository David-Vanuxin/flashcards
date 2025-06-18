function parse(separator, text) {
  return text.split("\n").map(string => string.split(separator))
}

function getTerms(splitted) {
  return splitted.map(pair => {
    return { answer: pair[0], question: pair[1] }
  })
}

export function getModule(name, separator, text) {
  return {
    name,
    terms: getTerms(parse(separator, text)),
  }
}
