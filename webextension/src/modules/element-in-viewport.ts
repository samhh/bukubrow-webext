const elementIsFullyInViewport = (element: HTMLElement): boolean => {
	const { top, bottom, left, right } = element.getBoundingClientRect();

	return (
		top >= 0 &&
		left >= 0 &&
		bottom <= window.innerHeight &&
		right <= window.innerWidth
	);
};

export default elementIsFullyInViewport;
