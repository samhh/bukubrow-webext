import { h } from 'preact'
import classNames from 'classnames'

import HighlightMarkup from './highlight-markup'

const bookmark = ({ title, url, desc, tags, textFilter, isFocused, openBookmark, ref }) => {
	const renderedTags = tags.split(',').reduce((acc, tag) => {
		// Split will leave some empty strings behind
		return tag ? acc.concat([
			<li className="bookmarks__item-tag">
				#<HighlightMarkup str={tag} match={textFilter} />
			</li>
		]) : acc
	}, [])

	const renderedDesc = desc ? (
		<p className="bookmarks__item-desc">
			> <HighlightMarkup str={desc} match={textFilter} />
		</p>
	) : null

	const classes = classNames('bookmarks__item', { 'bookmarks__item--focused': isFocused })

	return (
		<li
			key={title + url + desc + tags}
			className={classes}
			onClick={() => openBookmark(url)}
			ref={ref}
		>
			<header>
				<h1 className="bookmarks__item-name">
					<HighlightMarkup str={title} match={textFilter} />
				</h1>
				<ul className="bookmarks__item-tags">
					&nbsp;{renderedTags}
				</ul>
			</header>
			{renderedDesc}
			<h2 className="bookmarks__item-url">
				<HighlightMarkup str={url} match={textFilter} />
			</h2>
		</li>
	)
}

export default bookmark
