import { headerHeight as headerHeightInPx } from '~/containers/search-controls';
const headerHeight = parseInt(headerHeightInPx);

export const scrollToTop: IO<void> = () => {
	window.scrollTo(0, 0);
};

export const scrollToEl = (el: HTMLElement): void => {
	const elementRect = el.getBoundingClientRect();

	if (elementRect.top - headerHeight < 0) {
		window.scrollTo(0, elementRect.top - document.documentElement.getBoundingClientRect().top - headerHeight);
	} else if (window.innerHeight - elementRect.bottom < 0) {
		el.scrollIntoView(false);
	}
};
