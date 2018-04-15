import React, { Component, FormEvent } from 'react';
import cn from 'classnames';

import AsteriskIcon from '../assetsBundledOnly/asterisk.svg';
import RefreshIcon from '../assetsBundledOnly/refresh.svg';

interface Props {
	textFilter: string;
	shouldEnableSearch: boolean;
	updateTextFilter(textFilter: Props['textFilter']): void;
	triggerBookmarkOpen(): void;
	triggerBookmarkMultiOpen(): void;
	refreshBookmarks(): Promise<void>;
}

interface State {
	refreshInProgress: boolean;
}

class BookmarksForm extends Component<Props, State> {
	state = {
		refreshInProgress: false,
	};

	inputEl: HTMLInputElement | null = null;
	refreshBtnEl: HTMLButtonElement | null = null;

	componentDidMount (): void {
		if (this.inputEl) this.inputEl.focus();
	}

	// This prevents the refresh button from re-rendering and restarting the
	// animation once the updated data has been fetched
	shouldComponentUpdate (nextProps: Props, nextState: State): boolean {
		return !(
			nextProps.textFilter === this.props.textFilter &&
			nextProps.shouldEnableSearch === this.props.shouldEnableSearch &&
			nextState.refreshInProgress === this.state.refreshInProgress
		);
	}

	handleOpenAllBookmarks = (): void => {
		this.props.triggerBookmarkMultiOpen();
	}

	handleRefreshBookmarks = (): void => {
		if (this.state.refreshInProgress) return;

		this.setState({ refreshInProgress: true });

		// Wait for current animation iteration to complete before removing class
		const removeActiveClass = () => {
			this.setState({ refreshInProgress: false });

			if (this.refreshBtnEl) {
				this.refreshBtnEl.removeEventListener('animationiteration', removeActiveClass);
			}
		};

		this.props.refreshBookmarks()
			.then(() => {
				if (this.refreshBtnEl) {
					this.refreshBtnEl.addEventListener('animationiteration', removeActiveClass);
				}
			});
	}

	handleTextFilterUpdate = (evt: FormEvent<HTMLInputElement>): void => {
		this.props.updateTextFilter(evt.currentTarget.value);
	}

	handleSubmit = (evt: FormEvent<HTMLFormElement>): void => {
		evt.preventDefault();

		this.props.triggerBookmarkOpen();
	}

	render (): JSX.Element {
		const openAllBtnClasses = cn(
			'btn',
			'controls__btn',
		);

		const refreshBtnClasses = cn(
			'btn',
			'controls__btn',
			'controls__btn--refresh',
			{ 'controls__btn--active': this.state.refreshInProgress },
		);

		return (
			<header>
				<form
					onSubmit={this.handleSubmit}
					className="controls u-clearfix"
				>
					<input
						className="controls__search"
						type="text"
						name="search"
						autoComplete="off"
						placeholder="Search..."
						disabled={!this.props.shouldEnableSearch}
						onInput={this.handleTextFilterUpdate}
						value={this.props.textFilter}
						ref={(el) => { this.inputEl = el; }}
					/>

					<button
						className={openAllBtnClasses}
						type="button"
						onClick={this.handleOpenAllBookmarks}
					>
						<span
							className="btn__icon"
							dangerouslySetInnerHTML={{ __html: AsteriskIcon }}
						/>
						<span className="btn__tooltip">Open all matches</span>
					</button>

					<button
						className={refreshBtnClasses}
						type="button"
						onClick={this.handleRefreshBookmarks}
						ref={(el) => { this.refreshBtnEl = el; }}
					>
						<span
							className="btn__icon"
							dangerouslySetInnerHTML={{ __html: RefreshIcon }}
						/>
						<span className="btn__tooltip">Fetch bookmarks</span>
					</button>
				</form>
			</header>
		);
	}
}

export default BookmarksForm;
