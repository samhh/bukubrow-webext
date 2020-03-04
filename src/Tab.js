const { browser } = require('webextension-polyfill-ts');

const noop = () => {};

exports.getActiveTabImpl = () => browser.tabs.query({ active: true, currentWindow: true })
    .then((res) => res[0])
    .catch(noop);

exports.getActiveWindowTabsImpl = () => browser.tabs.query({ currentWindow: true }).catch(noop);

exports.getAllTabsImpl = () => browser.tabs.query({}).catch(noop);

exports.onTabActivity = (cb) => () => {
	browser.tabs.onActivated.addListener(cb);
	browser.tabs.onUpdated.addListener(cb);
};

exports.createTabImpl = (url) => () => browser.tabs.create({ url }).catch(noop);

exports.updateActiveTabImpl = (url) => () => browser.tabs.update(undefined, { url }).catch(noop);

exports.executeCodeInActiveTabImpl = (code) => () => browser.tabs.executeScript({ code }).catch(noop);


