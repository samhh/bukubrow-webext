const { browser } = require('webextension-polyfill-ts');

const noop = () => {};

exports.openPopup = () => {
	browser.browserAction.openPopup().catch(noop);
};

exports.closePopup = () => {
	window.close();
};

exports.getActiveTabImpl = () => browser.tabs.query({ active: true, currentWindow: true });

exports.getActiveWindowTabsImpl = () => browser.tabs.query({ currentWindow: true });

exports.getAllTabsImpl = () => browser.tabs.query({});

exports.onTabActivity = (cb) => () => {
	browser.tabs.onActivated.addListener(cb);
	browser.tabs.onUpdated.addListener(cb);
};

