import { contramap, ordNumber } from 'fp-ts/lib/Ord';
import { Lens } from 'monocle-ts';
import { LocalBookmark } from '~/modules/bookmarks';

export interface StagedBookmarksGroup {
	id: number;
	time: number;
	bookmarks: Array<LocalBookmark>;
}

export const id = Lens.fromProp<StagedBookmarksGroup>()('id');
export const time = Lens.fromProp<StagedBookmarksGroup>()('time');
export const bookmarks = Lens.fromProp<StagedBookmarksGroup>()('bookmarks');

export const ordStagedBookmarksGroup = contramap<number, StagedBookmarksGroup>(time.get)(ordNumber);

