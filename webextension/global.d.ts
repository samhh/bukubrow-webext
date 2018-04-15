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

// Bookmark as stored in Buku database
interface RemoteBookmark {
	desc: string;
	url: string;
	tags: string;
	metadata: string;
}

// Bookmark as stored in LocalStorage
interface LocalBookmark {
	key: number;
	title: string;
	desc: string;
	url: string;
	tags: string[];
}
