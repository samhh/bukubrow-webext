import { ordString, contramap, Ord, getSemigroup } from 'fp-ts/lib/Ord';
import { Lens } from 'monocle-ts';
import { formatDistanceToNow } from 'date-fns';
import { ParsedInputResult } from 'Modules/parse-search-input';
import { URLMatch, ordURLMatch } from 'Modules/compare-urls';
import { includesCaseInsensitive as includes } from 'Modules/string';
import { StagedBookmarksGroup } from 'Modules/staged-groups';
import { delimiter } from 'Modules/buku';

/*
 * Bookmark ready to be inserted into Buku database.
 */
export interface RemoteBookmarkUnsaved {
	metadata: string;
	desc: string;
	url: string;
	tags: string;
	flags: number;
}

/*
 * Bookmark as stored in Buku database.
 */
export interface RemoteBookmark extends RemoteBookmarkUnsaved {
	id: number;
}

/*
 * Bookmark ready to be saved.
 */
export interface LocalBookmarkUnsaved {
	title: string;
	desc: string;
	url: string;
	tags: Array<string>;
	flags: number;
}

/*
 * Bookmark as stored in LocalStorage.
 */
export interface LocalBookmark extends LocalBookmarkUnsaved {
	id: number;
}


export interface LocalBookmarkWeighted extends LocalBookmark {
	weight: URLMatch;
}

export const title = Lens.fromProp<LocalBookmarkUnsaved>()('title');
export const weight = Lens.fromProp<LocalBookmarkWeighted>()('weight');

const ordTitle: Ord<LocalBookmarkUnsaved> = contramap<string, LocalBookmarkUnsaved>(title.get)(ordString);
const ordWeight: Ord<LocalBookmarkWeighted> = contramap<URLMatch, LocalBookmarkWeighted>(weight.get)(ordURLMatch)
export const ordLocalBookmarkWeighted = getSemigroup<LocalBookmarkWeighted>().concat(ordWeight, ordTitle);

/**
 * Filter out bookmarks that do not perfectly match the provided test.
 */
export const filterBookmarks = (bookmarks: Array<LocalBookmark>, test: ParsedInputResult): Array<LocalBookmark> =>
	bookmarks.filter((bookmark) => {
		if (!includes(bookmark.title, test.name)) return false;
		if (test.desc.some(d => !includes(bookmark.desc, d))) return false;
		if (test.url.some(u => !includes(bookmark.url, u))) return false;
		if (test.tags.some(t => !bookmark.tags.some(tag => includes(tag, t)))) return false;

		// Ensure all wildcards match something
		const allWildcardsMatch = test.wildcard.every((wc) => {
			return (
				includes(bookmark.title, wc) ||
				includes(bookmark.desc, wc) ||
				includes(bookmark.url, wc) ||
				bookmark.tags.some(tag => includes(tag, wc))
			);
		});

		return allWildcardsMatch;
	});

/**
 * Transform a remote/native bookmark into the local format.
 */
export const transform = (bookmark: RemoteBookmark): LocalBookmark => ({
	id: bookmark.id,
	title: bookmark.metadata,
	// Buku uses commas as delimiters including at the start and end of the
	// string, so filter those out
	tags: bookmark.tags.split(delimiter).filter(tag => tag !== ''),
	url: bookmark.url,
	desc: bookmark.desc,
	flags: bookmark.flags,
});

/**
 * Transform a local bookmark into the remote/native format.
 */
export function untransform(bookmark: LocalBookmark): RemoteBookmark;
export function untransform(bookmark: LocalBookmarkUnsaved): RemoteBookmarkUnsaved;
export function untransform(bookmark: LocalBookmark | LocalBookmarkUnsaved):
RemoteBookmark | RemoteBookmarkUnsaved {
	const base: RemoteBookmarkUnsaved = {
		metadata: bookmark.title,
		tags: delimiter + bookmark.tags.join(delimiter) + delimiter,
		url: bookmark.url,
		desc: bookmark.desc,
		flags: bookmark.flags,
	};

	const transformed: RemoteBookmark | RemoteBookmarkUnsaved = 'id' in bookmark
		? { ...base, id: bookmark.id }
		: base;

	return transformed;
}

export const formatStagedBookmarksGroupTitle = (group: StagedBookmarksGroup): string =>
	`${group.bookmarks.length} bookmark${group.bookmarks.length === 1 ? '' : 's'}, ${formatDistanceToNow(group.time)} ago`;

