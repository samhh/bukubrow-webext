const adhereBookmarksToSchema = (bookmarks: RemoteBookmark[]): LocalBookmark[] =>
	bookmarks.map((bm, index) => ({
		key: index,
		title: bm.metadata,
		// Split can leave empty strings behind in the provided string, so filter
		// those
		tags: bm.tags.split(',').filter(tag => tag !== ' '),
		url: bm.url,
		desc: bm.desc,
	}));

export default adhereBookmarksToSchema;
