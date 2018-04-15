import React, { SFC } from 'react';
import strReplaceAsArr from 'string-replace-to-array';

interface Props {
	str: string;
	match: string;
}

// Replace each found instance of the text filter with JSX markup without
// changing the casing
const AddHighlightMarkup: SFC<Props> = ({ str, match }) => {
	const content = strReplaceAsArr(
		str,
		new RegExp(match, 'ig'),
		(matched, index) => (
			<span
				key={index}
				className="highlighted-text"
			>
				{matched}
			</span>
		),
	);

	return <span>{content}</span>;
};

export default AddHighlightMarkup;
