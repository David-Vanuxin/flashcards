function parse(separator, text) {
	return text.split("\n").map(string => string.split(separator))
}

function getTerms(splitted) {
	return splitted.map(pair => {
		return {answer:pair[0], question: pair[1]}
	})
}

export function getId(array) {
	if (array.length != 0) return array[array.length - 1].id + 1
	return 0
}

export function getModule(name, separator, text) {
	return {
		name,
		terms: getTerms( parse(separator, text) )
	}
}