export const transform = (bookmark: RemoteBookmark): LocalBookmark => ({
	id: bookmark.id,
	title: bookmark.metadata,
	// Split can leave empty strings behind in the provided string, so filter
	// those out
	tags: bookmark.tags.split(',').filter(tag => !!tag),
	url: bookmark.url,
	desc: bookmark.desc,
	flags: bookmark.flags,
});

// This could probably be improved by someone with a better understanding of
// generics
export const untransform = (bookmark: LocalBookmarkUnsaved | LocalBookmark):
RemoteBookmarkUnsaved | RemoteBookmark => {
	const base: RemoteBookmarkUnsaved = {
		metadata: bookmark.title,
		tags: bookmark.tags.join(','),
		url: bookmark.url,
		desc: bookmark.desc,
		flags: bookmark.flags,
	};

	const transformed: RemoteBookmark | RemoteBookmarkUnsaved = 'id' in bookmark
		? { ...base, id: bookmark.id }
		: base;

	return transformed;
};
