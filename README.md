Bukubrow
===

Bukubrow is a WebExtension for [Buku](https://github.com/jarun/Buku), a command-line bookmark manager.

A [native binary written in Rust](https://github.com/SamHH/bukubrow/tree/master/binary/) is used to interface with your Buku database. Communication between the binary and the browser extension is handled via [native messaging](https://developer.chrome.com/extensions/nativeMessaging).

## Prerequisites

- Buku
- Supported browser: Firefox, Chrome, or Chromium
- _If building the binary_:
	- Cargo (Rust)
- _If building the WebExtension_:
	- Node
	- Yarn

## Installation

Installing the binary and registering it with your browser is required to allow the browser extension to talk to Buku. If you move the binary you will have to re-register it.

### Step 1 - Installing the binary

If you've downloaded a binary zip from the [releases page](https://github.com/samhh/Bukubrow/releases), skip to step 3.

1. Clone the repo.
2. Run `make binary-linux-x64` (Linux) or `make binary-darwin-x64` (macOS). Note that you'll need your target platform installed and configured with Cargo. Your zip file will be located within the `./release/` directory.
3. Extract the zip file and move the binary to a suitable location, for example `/usr/local/bin/`.
4. Install the host file for your browser via the binary; options can be viewed with `bukubrow --help`.

### Step 2 - Installing the WebExtension

Install the WebExtension from the relevant addon store.

- Chrome/Chromium: https://chrome.google.com/webstore/detail/bukubrow/ghniladkapjacfajiooekgkfopkjblpn
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/bukubrow/

Alternatively, you can build the WebExtension manually as follows:

1. Clone the repo.
2. Run `make webext`. Your zip file will be located within the `./release/` directory. This zip file is the exact structure expected by all compatible browsers.
3. Load the extension in your browser. Please refer to the browser documentation.

## Contributing

This project is made up of two parts, the WebExtension and the binary.

### WebExtension

The WebExtension is written in strict TypeScript, utilising React for rendering and Redux with thunks for state management, and makes heavy use of the functional library Purify for ADT-driven data management and enhanced type safety. Yarn is used for dependency management and task running. Data is fetched from the binary via native messaging.

### Binary

The binary is written in Rust stable (1.34.1 at time of writing). The messages it expects to receive from the WebExtension backend follow a faux HTTP format; for instance, to get all the bookmarks, you pass it a JSON object of the following format: `{ method: 'GET' }`.
