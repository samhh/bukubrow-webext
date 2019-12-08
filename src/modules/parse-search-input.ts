import { pipe } from 'fp-ts/lib/pipeable';
import { constant } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';
import { exec, execMulti } from 'Modules/regex';

const nameRegExp = /^.*?(?:(?=^[#>:*].+)|(?= +[#>:*].+)|$)/;
const descsRegExp = /(?:^| )>(.+?)(?= +[#>:*]|$)/g;
const urlsRegExp = /(?:^| ):(.+?)(?= +[#>:*]|$)/g;
const tagsRegExp = /(?:^| )#(.+?)(?= +[#>:*]|$)/g;
const wildcardsRegExp = /(?:^| )\*(.+?)(?= +[#>:*]|$)/g;

export interface ParsedInputResult {
	name: string;
	desc: string[];
	url: string[];
	tags: string[];
	wildcard: string[];
}

/**
 * Parse input string into various matches.
 */
const parseSearchInput = (x: string): ParsedInputResult => {
	const f = execMulti(x);

	return {
		name: pipe(x, exec(nameRegExp), O.chain(A.head), O.getOrElse(constant(''))),
		desc: f(descsRegExp),
		url: f(urlsRegExp),
		tags: f(tagsRegExp),
		wildcard: f(wildcardsRegExp),
	};
};

export default parseSearchInput;

