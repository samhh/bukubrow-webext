const { browser } = require('webextension-polyfill-ts');

const noop = () => {};

exports.getLocalStorageImpl = (keys) => () => browser.storage.local.get(keys).catch(() => ({}));

exports.setLocalStorageImpl = (data) => () => browser.storage.local.set(data).catch(noop);

