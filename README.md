Bukubrow
=======

Bukubrow is a WebExtension for [Buku](https://github.com/jarun/Buku), a command-line bookmark manager. This WebExtension is developed to work in at least Chrome, Chromium, and Firefox, however any other browsers that support WebExtensions should also run this just fine.

It uses a [native binary written in Golang](https://github.com/samhh/Bukubrow/blob/master/binary/bukubrow.go) to interface with your Buku database. Secure communication between the binary and the browser extension is handled through [native messaging](https://developer.chrome.com/extensions/nativeMessaging).

This project has been heavily influenced by [browserpass](https://github.com/dannyvankooten/browserpass), a WebExtension designed to allow a similar kind of synchronicity between the browser and [pass](https://www.passwordstore.org).

## Requirements

- Buku
- A web browser that supports recent JavaScript standards and WebExtensions; this includes all recent releases of Chrome, Chromium, and Firefox.

## Installation

#### Part 1 - Installing the binary

Start out by downloading the [latest binary](https://github.com/samhh/Bukubrow/releases) for your operating system. Prebuilt binaries for 64-bit Linux & macOS are available.

1. Extract the package.
1. Run `./install.sh` to install the native messaging host. If you want a system-wide installation, run the script with `sudo`.

Installing the binary and registering it with your browser through the installation script is required to allow the browser extension to talk to Buku.

#### Part 2 - Installing the WebExtension

Install the WebExtension from the relevant addon store.

- Chrome: []()
- Firefox: []()

Alternatively, for Chrome and Chromium, you can download the .crx file directly from the [releases](https://github.com/samhh/Bukubrow/releases) page.

## Building

In order to build the .crx package for Chrome/Chromium you'll need one of [these](https://developer.chrome.com/extensions/crx#scripts) scripts. The makefile assumes it will be in your PATH under the name `crxmake`. It also assumes that you will have a private key in the project root directory under the name `key.pem`.

You'll usually only need to run `make release`, however the makefile is modular and you can run individual builds on demand as well. It also contains helper commands such as `make clean` (remove `.build` dir) and `make wipe` (previous plus remove `release` dir).
