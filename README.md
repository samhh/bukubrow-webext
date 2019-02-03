Bukubrow
===

Bukubrow is a WebExtension for [Buku](https://github.com/jarun/Buku), a command-line bookmark manager. This WebExtension is developed to work in at least Firefox, Chromium, and Chrome, however any other browsers that support modern WebExtension standards should also be compatible.

It uses a [native binary written in Rust](https://github.com/SamHH/bukubrow/tree/master/binary/src) to interface with your Buku database. Secure communication between the binary and the browser extension is handled via [native messaging](https://developer.chrome.com/extensions/nativeMessaging).

This project's foundation was heavily influenced by [browserpass](https://github.com/browserpass/browserpass), a WebExtension designed to allow a similar kind of synchronicity between the browser and [pass](https://www.passwordstore.org).

## Prerequisites

- Buku
- _If building the binary_:
	- Cargo (Rust)
- _If building the WebExtension_:
	- npm (Node)

## Installation

Installing the binary and registering it with your browser through the installation script is required to allow the browser extension to talk to Buku. If you move the binary you will have to re-register it.

#### Step 1 - Installing the binary

If you've downloaded a binary zip from the [releases page](https://github.com/samhh/Bukubrow/releases), skip to step 3.

1. Clone the repo.
2. Run `make binary-linux-x64` (Linux) or `make binary-darwin-x64` (macOS). Note that you'll need your target platform installed and configured with Cargo. Your zip file will be located within the `./release/` directory.
3. Move the zip file to a suitable location, for example `~/.bukubrow/`.
4. Extract the zip file.
5. Run `./install.sh` to install the native messaging host. If you want a system-wide installation, run the script with `sudo`.

#### Step 2 - Installing the WebExtension

Install the WebExtension from the relevant addon store.

- Chrome: https://chrome.google.com/webstore/detail/bukubrow/ghniladkapjacfajiooekgkfopkjblpn
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/bukubrow/

Alternatively, you can build the WebExtension manually as follows:

1. Clone the repo.
2. Run `make webext`. Your zip file will be located within the `./release/` directory. This zip file is the exact structure expected by all compatible browsers.

## Contributing

This project is made up of two parts, the WebExtension and the binary.

### WebExtension

The WebExtension is written in (mostly) scoped, vanilla CSS and TypeScript, using React as the view library and Redux (and Thunks) for state management. npm is used for dependency management and task running. Data is fetched from the binary via communication with the WebExtension backend.

### Binary

The binary is written in Rust stable (1.32.0 at time of writing). The messages it expects to receive from the WebExtension backend follow a faux HTTP format; for instance, to get all the bookmarks, you pass it a JSON object of the following format: `{ method: 'GET' }`.
