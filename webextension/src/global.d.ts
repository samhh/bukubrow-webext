type Nullable<T> = T | null;

type SubType<Base, Condition> = Pick<Base, {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
}[keyof Base]>;

// From: https://stackoverflow.com/a/53229567/3369753
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

// Helper, probably unneeded if thunk actions are better typed in this project
type UnwrapThunkActions<T> = {
	[K in keyof T]: T[K] extends (...args: infer U) => import('redux-thunk').ThunkAction<infer R, any, any, any>
		? (...args: U) => R
		: T[K];
};

type Comp<T = {}> = import('react').FunctionComponent<T>;

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
