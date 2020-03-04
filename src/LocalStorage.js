const { browser } = require('webextension-polyfill-ts');

const noop = () => {};

exports.getImpl = (keys) => () => browser.storage.local.get(keys).catch(() => ({}));

exports.setImpl = (data) => () => browser.storage.local.set(data).catch(noop);

