const nameRegExp = /^[^#>:]*?(?:(?= +[#>:].+)|$)/;
const descsRegExp = /(?<=(?:^| +)>).+?(?:(?= +[#>:].+)|$)/g;
const urlsRegExp = /(?<=(?:^| +):).+?(?:(?= +[#>:].+)|$)/g;
const tagsRegExp = /(?<=(?:^| +)#).+?(?:(?= +[#>:].+)|$)/g;

export interface ParsedInputResult {
	name: string;
	desc: string[];
	url: string[];
	tags: string[];
}

const parseSearchInput = (input: string): ParsedInputResult => ({
	name: (input.match(nameRegExp) || [])[0] || '',
	desc: input.match(descsRegExp) || [],
	url: input.match(urlsRegExp) || [],
	tags: input.match(tagsRegExp) || [],
});

export default parseSearchInput;
