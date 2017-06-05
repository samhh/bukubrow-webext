import { h } from 'preact'
import strReplaceAsArr from 'string-replace-to-array'

// Replace each found instance of the text filter with JSX markup without
// changing the casing
const addHighlightMarkup = ({ str, match }) => {
	const content = strReplaceAsArr(
		str,
		new RegExp(match, 'ig'),
		matched => <span className="highlighted-text">{matched}</span>
	)

	return <span>{content}</span>
}

export default addHighlightMarkup
