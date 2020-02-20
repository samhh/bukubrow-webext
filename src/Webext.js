const { browser } = require('webextension-polyfill-ts');

const noop = () => {};

exports.openPopup = () => {
	browser.browserAction.openPopup().catch(noop);
};

exports.closePopup = () => {
	window.close();
};

exports.getActiveTabImpl = () => browser.tabs.query({ active: true, currentWindow: true })
    .then((res) => res[0])
    .catch(noop);

exports.getActiveWindowTabsImpl = () => browser.tabs.query({ currentWindow: true }).catch(noop);

exports.getAllTabsImpl = () => browser.tabs.query({}).catch(noop);

exports.onTabActivity = (cb) => () => {
	browser.tabs.onActivated.addListener(cb);
	browser.tabs.onUpdated.addListener(cb);
};

