# Bukubrow

Bukubrow is a WebExtension for [Buku](https://github.com/jarun/Buku), a command-line bookmark manager.

- Display, open, add, edit, and delete bookmarks
- Automatically save open tabs to the _staging area_ from the context menu, from which they can be optionally edited and saved
- Filter bookmarks with any of the following syntax: `:url`, `>description`, `#tag`, `*wildcard`
- Bookmarklet (arbitrary JavaScript scripting) support, simply prepend your "URL" with `javascript:`, for example: `javascript:document.body.style.background = 'red'`
- Custom hotkeys are available - please read the instructions [here](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/commands#Updating_shortcuts) to customise them in your browser

## Prerequisites

A corresponding [native host](https://github.com/SamHH/bukubrow-host) is used to interface with your Buku database. Communication between the host and the browser extension is handled via [native messaging](https://developer.chrome.com/extensions/nativeMessaging).

- Buku
- Bukubrow Host
- Supported browser: Firefox, Chrome, or Chromium
- _If building the WebExtension_:
  - Node
  - Yarn

## Installation

Installing the host and registering it with your browser is required to allow the browser extension to talk to Buku.

Install the WebExtension from the relevant addon store.

- Chrome/Chromium: https://chrome.google.com/webstore/detail/bukubrow/ghniladkapjacfajiooekgkfopkjblpn
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/bukubrow/

Alternatively, you can build the WebExtension manually as follows:

1. Clone the repo.
2. Run `make webext`. Your zip file will be located within the `./release/` directory. This zip file is the exact structure expected by all compatible browsers.
3. Load the extension in your browser. Please refer to the browser documentation.

## Contributing

The WebExtension is written in strict TypeScript, utilising React for rendering and Redux with thunks for state management, and makes heavy use of the functional library `fp-ts` for ADT-driven data management and enhanced type safety. Yarn is used for dependency management and task running. Data is fetched from the host via native messaging.
