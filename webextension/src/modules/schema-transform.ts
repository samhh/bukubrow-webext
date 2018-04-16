export const transform = (bookmarks: RemoteBookmark[]): LocalBookmark[] =>
	bookmarks.map(bm => ({
		id: bm.id,
		title: bm.metadata,
		// Split can leave empty strings behind in the provided string, so filter
		// those out
		tags: bm.tags.split(',').filter(tag => !!tag),
		url: bm.url,
		desc: bm.desc,
		flags: bm.flags,
	}));

export const untransform = (bookmarks: LocalBookmark[]): RemoteBookmarkUnsaved[] =>
	bookmarks.map(bm => ({
		id: bm.id,
		metadata: bm.title,
		tags: bm.tags.join(','),
		url: bm.url,
		desc: bm.desc,
		flags: bm.flags,
	}));
