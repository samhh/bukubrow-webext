declare module '*.css' {
	const content: any;
	export default content;
}

declare module '*.svg' {
	const content: any;
	export default content;
}

declare module 'string-replace-to-array' {
	export default function<T>(
		string: string,
		regexpOrSubstr: RegExp | string,
		nsof: (matched: string, index: number) => T,
	): T[];
}

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

// Bookmark as stored in LocalStorage
interface LocalBookmark {
	id: number;
	title: string;
	desc: string;
	url: string;
	tags: string[];
	flags: number;
}
