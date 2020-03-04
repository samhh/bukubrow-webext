const { browser } = require('webextension-polyfill-ts');

const noop = () => {};

exports.getImpl = (keys) => () => browser.storage.sync.get(keys).catch(() => ({}));

exports.setImpl = (data) => () => browser.storage.sync.set(data).catch(noop);

