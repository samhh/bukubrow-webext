Bukubrow [![Build Status](https://travis-ci.org/SamHH/bukubrow.svg?branch=master)](https://travis-ci.org/SamHH/bukubrow)
===

Bukubrow is a WebExtension for [Buku](https://github.com/jarun/Buku), a command-line bookmark manager. This WebExtension is developed to work in at least Chrome, Chromium, and Firefox, however any other browsers that support WebExtensions should also run this just fine.

It uses a [native binary written in Rust](https://github.com/samhh/Bukubrow/blob/master/binary/src/main.rs) to interface with your Buku database. Secure communication between the binary and the browser extension is handled through [native messaging](https://developer.chrome.com/extensions/nativeMessaging).

This project has been heavily influenced by [browserpass](https://github.com/dannyvankooten/browserpass), a WebExtension designed to allow a similar kind of synchronicity between the browser and [pass](https://www.passwordstore.org).

## Prerequisites

- Buku
- A web browser that supports recent web standards and WebExtensions; this includes all recent releases of Chrome, Chromium, and Firefox.

## Installation

#### Step 1 - Installing the binary

Start out by downloading the [latest binary](https://github.com/samhh/Bukubrow/releases) for your operating system. As I have yet to successfully cross-compile, the existence of an up-to-date pre-compiled binary for your OS will be hit and miss. Should you need to build it yourself, refer to [building](#building).

1. Extract the package.
2. Run `./install.sh` to install the native messaging host. If you want a system-wide installation, run the script with `sudo`.

Installing the binary and registering it with your browser through the installation script is required to allow the browser extension to talk to Buku.

Note that the binary must always remain in the same location in order for the browser to find it. If you move or delete the file you will need to install / register it with the browser again.

#### Step 2 - Installing the WebExtension

Install the WebExtension from the relevant addon store.

- Chrome: https://chrome.google.com/webstore/detail/bukubrow/ghniladkapjacfajiooekgkfopkjblpn
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/bukubrow/

## Building<a name="building"></a>

### Building the binary

1. Clone the repo.
2. Install the SQLite 3 development packages. Refer to the README of our dependency: https://github.com/jgallagher/rusqlite
3. Run `make binary-linux-x64` (or substitute `binary-linux-x64` for your preferred target) and then inside `./release` you'll have a zip identical to what you would have downloaded as a binary in step 1. Note that you'll need your target platform installed and configured with Cargo (Rust package manager).

### Building the WebExtension

1. Clone the repo
2. Run `make webext` and then inside `./release` you'll have a zip containing all required files and folders in the expected structure.

### Building everything

You can alternatively build everything all at once with `make release`.

## Contributing

This project is made up of two parts, the WebExtension and the binary.

### WebExtension

The WebExtension is written in (mostly) scoped, vanilla CSS and TypeScript, using React as the view library. npm is used for dependency management and task running. Broadly, it communicates with the (WebExtension) backend what it wants, and reacts according to the data it receives back.

### Binary

The binary is written in Rust stable, and as you'd expect Cargo is used for dependency management. The messages it expects to receive from the WebExtension backend follow a faux HTTP format; for instance, to get all the bookmarks, you pass it a JSON object of the following format: `{ method: 'GET' }`. The easiest way to visualise these is to view the TypeScript interfaces for them.
