export const scrollToTop: IO<void> = () => {
	window.scrollTo(0, 0);
};

export const scrollToEl = (el: HTMLElement): IO<void> => (): void => {
	const headerHeight = parseInt(window.getComputedStyle(document.body).getPropertyValue('--header-height'), 10);

	window.scrollTo(0, el.getBoundingClientRect().top - document.documentElement.getBoundingClientRect().top - headerHeight);
};

