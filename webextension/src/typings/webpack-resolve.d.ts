/* eslint-disable import/export */

declare module '*.css' {
	const content: Record<string, string>;
	export default content;
}

declare module '*.svg' {
	const content: string;
	export default content;
}
