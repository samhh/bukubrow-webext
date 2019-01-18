const bukuDelimiter = ',';

export const transform = (bookmark: RemoteBookmark): LocalBookmark => ({
	id: bookmark.id,
	title: bookmark.metadata,
	// Buku uses commas as delimiters including at the start and end of the
	// string, so filter those out
	tags: bookmark.tags.split(bukuDelimiter).filter(tag => tag !== ''),
	url: bookmark.url,
	desc: bookmark.desc,
	flags: bookmark.flags,
});

export function untransform(bookmark: LocalBookmark): RemoteBookmark;
export function untransform(bookmark: LocalBookmarkUnsaved): RemoteBookmarkUnsaved;
export function untransform(bookmark: LocalBookmark | LocalBookmarkUnsaved):
RemoteBookmark | RemoteBookmarkUnsaved {
	const base: RemoteBookmarkUnsaved = {
		metadata: bookmark.title,
		tags: bukuDelimiter + bookmark.tags.join(bukuDelimiter) + bukuDelimiter,
		url: bookmark.url,
		desc: bookmark.desc,
		flags: bookmark.flags,
	};

	const transformed: RemoteBookmark | RemoteBookmarkUnsaved = 'id' in bookmark
		? { ...base, id: bookmark.id }
		: base;

	return transformed;
}
