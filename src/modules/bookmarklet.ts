import { Newtype, prism } from 'newtype-ts';
import { startsWith } from '~/modules/string';

export const isBookmarkletCode: Predicate<string> = startsWith('javascript:');

export type BookmarkletCode = Newtype<{ readonly BookmarkletCode: unique symbol }, string>;
export const {
	getOption: mkBookmarkletCode,
	reverseGet: unBookmarkletCode,
} = prism<BookmarkletCode>(isBookmarkletCode);

