exports.addHtmlClass = (name) => () => {
    document.documentElement.classList.add(name);
};

exports.removeHtmlClass = (name) => () => {
    document.documentElement.classList.remove(name);
};

