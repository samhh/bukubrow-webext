type Option<A> = import('fp-ts/lib/Option').Option<A>;
type OptionTuple<A, B> = Option<[A, B]>;
type Either<E, A> = import('fp-ts/lib/Either').Either<E, A>;
type Task<A> = import('fp-ts/lib/Task').Task<A>;
type TaskEither<E, A> = import('fp-ts/lib/TaskEither').TaskEither<E, A>;
type IO<A> = import('fp-ts/lib/IO').IO<A>;
type NonEmptyArray<A> = import('fp-ts/lib/NonEmptyArray').NonEmptyArray<A>;

type SubType<Base, Condition> = Pick<Base, {
	[Key in keyof Base]: Base[Key] extends Condition ? Key : never;
}[keyof Base]>;

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? DeepPartial<U>[]
		: T[P] extends ReadonlyArray<infer U>
			? ReadonlyArray<DeepPartial<U>>
			: DeepPartial<T[P]>
};

// Bookmark ready to be inserted into Buku database
interface RemoteBookmarkUnsaved {
	metadata: string;
	desc: string;
	url: string;
	tags: string;
	flags: number;
}

// Bookmark as stored in Buku database
interface RemoteBookmark extends RemoteBookmarkUnsaved {
	id: number;
}

// Bookmark ready to be saved
interface LocalBookmarkUnsaved {
	title: string;
	desc: string;
	url: string;
	tags: string[];
	flags: number;
}

// Bookmark as stored in LocalStorage
interface LocalBookmark extends LocalBookmarkUnsaved {
	id: number;
}

interface StagedBookmarksGroup {
	id: number;
	time: number;
	bookmarks: LocalBookmark[];
}

