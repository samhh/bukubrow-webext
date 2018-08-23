export const transform = (bookmark: RemoteBookmark): LocalBookmark => ({
	id: bookmark.id,
	title: bookmark.metadata,
	// Split can leave empty strings behind in the provided string, so filter
	// those out
	tags: new Set(bookmark.tags.split(',').filter(tag => !!tag)),
	url: bookmark.url,
	desc: bookmark.desc,
	flags: bookmark.flags,
});

type untransformResult = {
	LocalBookmark: RemoteBookmark;
	LocalBookmarkUnsaved: RemoteBookmarkUnsaved;
};

export function untransform(bookmark: LocalBookmark): RemoteBookmark;
export function untransform(bookmark: LocalBookmarkUnsaved): RemoteBookmarkUnsaved;
export function untransform(bookmark: LocalBookmark | LocalBookmarkUnsaved):
RemoteBookmark | RemoteBookmarkUnsaved {
	const base: RemoteBookmarkUnsaved = {
		metadata: bookmark.title,
		tags: Array.from(bookmark.tags).join(','),
		url: bookmark.url,
		desc: bookmark.desc,
		flags: bookmark.flags,
	};

	const transformed: RemoteBookmark | RemoteBookmarkUnsaved = 'id' in bookmark
		? { ...base, id: bookmark.id }
		: base;

	return transformed;
}
