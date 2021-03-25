import { headerHeight as headerHeightInPx } from '~/containers/search-controls';
const headerHeight = parseInt(headerHeightInPx);

export const scrollToTop: IO<void> = () => {
	window.scrollTo(0, 0);
};

export const scrollToEl = (el: HTMLElement): void => {

	window.scrollTo(0, el.getBoundingClientRect().top - document.documentElement.getBoundingClientRect().top - headerHeight);
};

