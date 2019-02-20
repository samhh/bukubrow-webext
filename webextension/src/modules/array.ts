export const sortByObjectStringValue = <T extends object>(ao: T[], sortKey: keyof T): T[] => {
	// Cannot figure out how to make this work without any assertion...
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return [...ao].sort((a, b) => (a[sortKey] as any).localeCompare(b[sortKey]));
};
