const { browser } = require('webextension-polyfill-ts');

const noop = () => {};

exports.openPopup = () => {
	browser.browserAction.openPopup().catch(noop);
};

exports.closePopup = () => {
	window.close();
};

exports.getSyncStorageImpl = (keys) => () => browser.storage.sync.get(keys).catch(() => ({}));

exports.setSyncStorageImpl = (data) => () => browser.storage.sync.set(data).catch(noop);

