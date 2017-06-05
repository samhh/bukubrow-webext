const adhereBookmarksToSchema = bookmarks => {
	const formattedBookmarks = bookmarks.map(bookmark => {
		const newBookmark = {}

		newBookmark.title = bookmark.Metadata
		newBookmark.tags = bookmark.Tags
		newBookmark.url = bookmark.Url
		newBookmark.desc = bookmark.Desc

		return newBookmark
	})

	return formattedBookmarks
}

export default adhereBookmarksToSchema
