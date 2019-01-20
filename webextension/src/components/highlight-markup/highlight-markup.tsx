import React, { SFC } from 'react';
import strReplaceAsArr from 'string-replace-to-array';
import styles from './highlight-markup.css';

interface Props {
	str: string;
	match: string | string[];
}

// Replace all matches against the string with special markup
const AddHighlightMarkup: SFC<Props> = ({ str, match }) => {
	// Sort matches by descending length to prevent pointless double matching.
	// Note that there's no real check for overlap which can cause missing
	// highlights under some circumstances e.g. given tag #shopping and match tags
	// #hop, #ing, and #pp, the second "p" will not be highlighted
	const sortedMatches = Array.isArray(match)
		? match.sort((a, b) => b.length - a.length)
		: [match];

	let content: (string | JSX.Element)[] = [str];

	for (const match of sortedMatches) {
		// Only match against strings i.e. don't touch markup as these are already
		// matches, and don't need testing
		content = content.flatMap(c => typeof c === 'string'
			? strReplaceAsArr(
					c,
					new RegExp(match, 'ig'),
					(matched, index) => (
						<span
							key={index}
							className={styles.highlight}
						>
							{matched}
						</span>
					),
				)
			: c);
	}

	return <span>{content}</span>;
};

export default AddHighlightMarkup;
