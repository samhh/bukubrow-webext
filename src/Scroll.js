exports.windowScrollTo = (x) => (y) => () => {
    window.scrollTo(x, y);
};

exports.scrollToEl = (f) => (el) => () => {
    const basis =
        el.getBoundingClientRect().top - document.documentElement.getBoundingClientRect().top;

    window.scrollTo(0, f(basis));
};

