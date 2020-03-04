const { browser } = require('webextension-polyfill-ts');

const noop = () => {};

exports.getSyncStorageImpl = (keys) => () => browser.storage.sync.get(keys).catch(() => ({}));

exports.setSyncStorageImpl = (data) => () => browser.storage.sync.set(data).catch(noop);

