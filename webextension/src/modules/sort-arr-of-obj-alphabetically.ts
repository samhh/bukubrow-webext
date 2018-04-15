interface StringObject {
	[key: string]: any;
}

const sortArrOfObjAlphabetically = (ao: StringObject[], sortKey: string): StringObject[] =>
	[...ao].sort((a, b) => a[sortKey].localeCompare(b[sortKey]));

export default sortArrOfObjAlphabetically;
