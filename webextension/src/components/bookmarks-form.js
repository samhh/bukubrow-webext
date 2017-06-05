import { h, Component } from 'preact'
import classNames from 'classnames'

import RefreshIcon from '../assetsBundledOnly/refresh.svg'

class BookmarksForm extends Component {
	state = {
		refreshInProgress: false
	}

	componentDidMount () {
		this.inputEl.focus()
	}

	// This prevents the refresh button from re-rendering and restarting the
	// animation once the updated data has been fetched
	shouldComponentUpdate (nextProps, nextState) {
		return !(
			nextProps.textFilter === this.props.textFilter &&
			nextProps.shouldEnableSearch === this.props.shouldEnableSearch &&
			nextState.refreshInProgress === this.state.refreshInProgress
		)
	}

	handleRefreshBookmarks = () => {
		if (this.state.refreshInProgress) return

		this.setState({ refreshInProgress: true })

		// Wait for current animation iteration to complete before removing class
		const removeActiveClass = () => {
			this.setState({ refreshInProgress: false })

			this.refreshBtnEl.removeEventListener('animationiteration', removeActiveClass)
		}

		this.props.refreshBookmarks()
			.then(() => {
				this.refreshBtnEl.addEventListener('animationiteration', removeActiveClass)
			})
	}

	handleSubmit = evt => {
		evt.preventDefault()

		this.props.triggerBookmarkOpen()
	}

	render ({ textFilter, updateTextFilter, shouldEnableSearch }, { refreshInProgress }) {
		const refreshBtnClasses = classNames(
			'btn',
			'btn--no-padding',
			'controls__refresh',
			{ 'controls__refresh--active': refreshInProgress }
		)

		return (
			<header className="controls u-clearfix">
				<form
					onSubmit={this.handleSubmit}
				>
					<input
						className="controls__search"
						type="text"
						name="search"
						autocomplete="off"
						placeholder="Search..."
						disabled={!shouldEnableSearch}
						onInput={updateTextFilter}
						value={textFilter}
						ref={el => { this.inputEl = el }}
					/>
					<button
						className={refreshBtnClasses}
						type="button"
						onClick={this.handleRefreshBookmarks}
						dangerouslySetInnerHTML={{ __html: RefreshIcon }}
						ref={el => { this.refreshBtnEl = el }}
					>
					</button>
				</form>
			</header>
		)
	}
}

export default BookmarksForm
