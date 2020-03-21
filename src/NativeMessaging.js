const { browser } = require('webextension-polyfill-ts');

const noop = () => {};

exports.sendNativeMessageImpl = (appName) => (data) => () =>
    browser.runtime.sendNativeMessage(appName, data)
        .catch(noop)
        .then((x) => x === undefined ? {} : x);

