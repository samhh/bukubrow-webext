declare module 'string-replace-to-array' {
	export default function<T>(
		string: string,
		regexpOrSubstr: RegExp | string,
		nsof: (matched: string, index: number) => T,
	): (T | string)[];
}
