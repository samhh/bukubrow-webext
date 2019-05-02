export const matchesTerminology = (num: number) => {
	switch (num) {
		case 0: return 'No bookmarks to open';
		case 1: return 'Open bookmark';
		case 2: return 'Open both bookmarks';
		default: return `Open all ${num} bookmarks`;
	}
};
