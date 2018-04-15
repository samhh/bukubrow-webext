const filterBookmarks = (bookmarks: LocalBookmark[], textFilter: string): LocalBookmark[] => {
	const filter = textFilter.toLowerCase();

	// Using separate arrays is an easy way to weight/sort matches
	const titleMatches: LocalBookmark[] = [];
	const tagMatches: LocalBookmark[] = [];
	const urlMatches: LocalBookmark[] = [];
	const descMatches: LocalBookmark[] = [];

	bookmarks.forEach((bookmark) => {
		if (bookmark.title.toLowerCase().includes(filter)) titleMatches.push(bookmark);
		else if (bookmark.tags.some(tag => tag.toLowerCase().includes(filter))) tagMatches.push(bookmark);
		else if (bookmark.url.toLowerCase().includes(filter)) urlMatches.push(bookmark);
		else if (bookmark.desc.toLowerCase().includes(filter)) descMatches.push(bookmark);
	});

	return [...titleMatches, ...tagMatches, ...urlMatches, ...descMatches];
};

export default filterBookmarks;
