import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';
import { ordString, contramap, Ord, getMonoid, fromCompare } from 'fp-ts/lib/Ord';
import { invert } from 'fp-ts/lib/Ordering';
import * as A from 'fp-ts/lib/Array';
import * as S from 'fp-ts-std/String';
import { Lens } from 'monocle-ts';
import { isNonEmptyString } from 'newtype-ts/lib/NonEmptyString';
import { formatDistanceToNow } from 'date-fns';
import { ParsedInputResult } from '~/modules/parse-search-input';
import { URLMatch, ordURLMatch } from '~/modules/compare-urls';
import { includesCI } from '~/modules/string';
import { StagedBookmarksGroup } from '~/modules/staged-groups';
import { delimiter } from '~/modules/buku';

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

export const id = Lens.fromProp<LocalBookmark>()('id');
export const title = Lens.fromProp<LocalBookmarkUnsaved>()('title');
export const weight = Lens.fromProp<LocalBookmarkWeighted>()('weight');

const ordTitle: Ord<LocalBookmarkUnsaved> = contramap<string, LocalBookmarkUnsaved>(title.get)(ordString);
const ordWeight: Ord<LocalBookmarkWeighted> = contramap<URLMatch, LocalBookmarkWeighted>(weight.get)(ordURLMatch)
// The ordering of bookmark weight should be inverted for the UI
const ordWeightForUI: Ord<LocalBookmarkWeighted> = fromCompare(flow(ordWeight.compare, invert));
export const ordLocalBookmarkWeighted = getMonoid<LocalBookmarkWeighted>().concat(ordWeightForUI, ordTitle);

/**
 * Filter out bookmarks that do not perfectly match the provided test.
 */
export const filterBookmark = (test: ParsedInputResult): Predicate<LocalBookmark> => (bookmark): boolean => {
	if (!includesCI(test.name)(bookmark.title)) return false;
	if (test.desc.some(d => !includesCI(d)(bookmark.desc))) return false;
	if (test.url.some(u => !includesCI(u)(bookmark.url))) return false;
	if (test.tags.some(t => !bookmark.tags.some(tag => includesCI(t)(tag)))) return false;

	// Ensure all wildcards match something
	const allWildcardsMatch = test.wildcard.every((wc) => {
		return (
			includesCI(wc)(bookmark.title) ||
			includesCI(wc)(bookmark.desc) ||
			includesCI(wc)(bookmark.url) ||
			bookmark.tags.some(tag => includesCI(wc)(tag))
		);
	});

	return allWildcardsMatch;
};

/**
 * Transform a remote/native bookmark into the local format.
 */
export const transform = (bookmark: RemoteBookmark): LocalBookmark => ({
	id: bookmark.id,
	title: bookmark.metadata,
	// Buku uses commas as delimiters including at the start and end of the
	// string, so filter those out
	tags: pipe(bookmark.tags, S.split(delimiter), A.filter(isNonEmptyString)),
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

