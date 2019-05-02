export const scrollToTop = () => {
	window.scrollTo(0, 0);
};

export const scrollToEl = (el: HTMLElement) => {
	const headerHeight = parseInt(window.getComputedStyle(document.body).getPropertyValue('--header-height'), 10);

	window.scrollTo(0, el.getBoundingClientRect().top - document.documentElement.getBoundingClientRect().top - headerHeight);
};
