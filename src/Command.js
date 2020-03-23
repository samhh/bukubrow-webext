const { browser } = require('webextension-polyfill-ts');

exports.onCommand = (cb) => () => {
    browser.commands.onCommand.addListener(cb);
};

