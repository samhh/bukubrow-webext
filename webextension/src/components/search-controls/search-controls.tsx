import React, { Component, createRef, FormEvent, RefObject } from 'react';
import cn from 'classnames';
import styles from './search-controls.css';

import AsteriskIcon from 'Assets/asterisk.svg';
import Button, {
	ForwardRefElementType as ButtonForwardRefElementType,
} from 'Components/button/';
import TextInput, {
	ForwardRefElementType as TextInputForwardRefElementType,
} from 'Components/text-input/';
import PlusIcon from 'Assets/plus.svg';
import RefreshIcon from 'Assets/refresh.svg';

interface Props {
	textFilter: string;
	shouldEnableSearch: boolean;
	onAdd(): void;
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

	inputRef = createRef<TextInputForwardRefElementType>();
	refreshBtnRef = createRef<ButtonForwardRefElementType>();

	componentDidMount (): void {
		if (this.inputRef.current) this.inputRef.current.focus();
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

			if (this.refreshBtnRef.current) {
				(this.refreshBtnRef.current as HTMLElement)
					.removeEventListener('animationiteration', removeActiveClass);
			}
		};

		this.props.refreshBookmarks()
			.then(() => {
				if (this.refreshBtnRef.current) {
					(this.refreshBtnRef.current as HTMLElement)
						.addEventListener('animationiteration', removeActiveClass);
				}
			});
	}

	handleTextFilterUpdate = (textFilter: string): void => {
		this.props.updateTextFilter(textFilter);
	}

	handleSubmit = (evt: FormEvent<HTMLFormElement>): void => {
		evt.preventDefault();

		this.props.triggerBookmarkOpen();
	}

	render (): JSX.Element {
		return (
			<nav>
				<form
					onSubmit={this.handleSubmit}
					className={`u-clearfix ${styles.wrapper}`}
				>
					<TextInput
						value={this.props.textFilter}
						onInput={this.handleTextFilterUpdate}
						placeholder="Search..."
						disabled={!this.props.shouldEnableSearch}
						className={styles.search}
						ref={this.inputRef}
					/>

					<Button
						className={styles.btn}
						tooltipClassName={styles.tooltip}
						type="button"
						onClick={this.handleOpenAllBookmarks}
						iconHTML={AsteriskIcon}
						tooltip="Open all matches"
					/>

					<Button
						className={styles.btn}
						tooltipClassName={styles.tooltip}
						type="button"
						onClick={this.props.onAdd}
						iconHTML={PlusIcon}
						tooltip="Add a bookmark"
					/>

					<Button
						className={cn(styles.btn, styles['btn--refresh'], {
							[styles['btn--active']]: this.state.refreshInProgress,
						})}
						tooltipClassName={styles.tooltip}
						type="button"
						onClick={this.handleRefreshBookmarks}
						iconHTML={RefreshIcon}
						tooltip="Fetch bookmarks"
						ref={this.refreshBtnRef}
					/>
				</form>
			</nav>
		);
	}
}

export default BookmarksForm;
