const adhereBookmarksToSchema = bookmarks => bookmarks.map((bm, index) => ({
	key: index,
	title: bm.metadata,
	tags: bm.tags,
	url: bm.url,
	desc: bm.desc
}))

export default adhereBookmarksToSchema
