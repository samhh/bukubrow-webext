const { browser } = require('webextension-polyfill-ts');

const noop = () => {};

exports.openPopup = () => {
	browser.browserAction.openPopup().catch(noop);
};

exports.closePopup = () => {
	window.close();
};

