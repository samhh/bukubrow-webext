function sortArrOfObjAlphabetically
<T extends object, U extends keyof SubType<T, string>>(ao: T[], sortKey: U): T[] {
	// Cannot figure out how to make this work without any assertion...
	return [...ao].sort((a, b) => (a[sortKey] as any).localeCompare(b[sortKey]));
}

export default sortArrOfObjAlphabetically;
