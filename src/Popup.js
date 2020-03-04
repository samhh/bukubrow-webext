const { browser } = require('webextension-polyfill-ts');

const noop = () => {};

exports.open = () => {
	browser.browserAction.openPopup().catch(noop);
};

exports.close = () => {
	window.close();
};

