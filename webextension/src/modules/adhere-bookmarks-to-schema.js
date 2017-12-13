const adhereBookmarksToSchema = bookmarks => bookmarks.map(bm => ({
	title: bm.metadata,
	tags: bm.tags,
	url: bm.url,
	desc: bm.desc
}))

export default adhereBookmarksToSchema
