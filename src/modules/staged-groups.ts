import { LocalBookmark } from 'Modules/bookmarks';

export interface StagedBookmarksGroup {
	id: number;
	time: number;
	bookmarks: LocalBookmark[];
}

