const filterBookmarks = (bookmarks, textFilter) => {
	const filter = textFilter.toLowerCase()

	// Using separate arrays is an easy way to weight/sort matches
	const titleMatches = []
	const tagMatches = []
	const urlMatches = []
	const descMatches = []

	bookmarks.forEach(bookmark => {
		if (bookmark.title.toLowerCase().includes(filter)) titleMatches.push(bookmark)
		else if (bookmark.tags.toLowerCase().includes(filter)) tagMatches.push(bookmark)
		else if (bookmark.url.toLowerCase().includes(filter)) urlMatches.push(bookmark)
		else if (bookmark.desc.toLowerCase().includes(filter)) descMatches.push(bookmark)
	})

	return [...titleMatches, ...tagMatches, ...urlMatches, ...descMatches]
}

export default filterBookmarks
