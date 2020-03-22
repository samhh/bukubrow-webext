const { browser } = require('webextension-polyfill-ts');

exports.sendNativeMessageImpl = (appName) => (data) => () =>
    browser.runtime.sendNativeMessage(appName, data);

