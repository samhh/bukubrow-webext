# The use of `${MAKE} target` is to allow the reuse of targets and also ensure
# explicit ordering

SHELL := /usr/bin/env bash

# Vars
TEMP_BUILD_DIR = .build
RELEASE_DIR = release

# Prepare build and release dirs
.PHONY: prepare
prepare:
	mkdir -p $(TEMP_BUILD_DIR) $(RELEASE_DIR)

# Remove build dir
.PHONY: clean
clean:
	rm -rf $(TEMP_BUILD_DIR)

# Remove build and release dirs
.PHONY: wipe
wipe:
	${MAKE} clean
	rm -rf $(RELEASE_DIR)

# Build WebExtension via npm and zip into release dir
.PHONY: webext
webext:
	${MAKE} prepare
	cd webextension && npm i && npm run build
	cd webextension/dist && zip -r '../../$(RELEASE_DIR)/webext' ./*
	${MAKE} clean

# Copy files over to build dir as expected by binary
.PHONY: prepare-binary
prepare-binary:
	${MAKE} prepare
	cp binary/browser-hosts/chrome.json $(TEMP_BUILD_DIR)/chrome-host.json
	cp binary/browser-hosts/firefox.json $(TEMP_BUILD_DIR)/firefox-host.json
	cp binary/install.sh $(TEMP_BUILD_DIR)/

# Build Linux binary
.PHONY: binary-linux-x64-build
binary-linux-x64-build:
	cd binary && cargo build --release --target=x86_64-unknown-linux-gnu

# Build macOS binary
.PHONY: binary-darwin-x64-build
binary-darwin-x64-build:
	cd binary && cargo build --release --target=x86_64-apple-darwin

# Bundle Linux binary
.PHONY: binary-linux-x64-bundle
binary-linux-x64-bundle:
	mv binary/target/x86_64-unknown-linux-gnu/release/bukubrow $(TEMP_BUILD_DIR)/bukubrow-linux-x64
	cd $(TEMP_BUILD_DIR) && zip -r '../$(RELEASE_DIR)/binary-linux-x64' ./*

# Bundle macOS binary
.PHONY: binary-darwin-x64-bundle
binary-darwin-x64-bundle:
	mv binary/target/x86_64-apple-darwin/release/bukubrow $(TEMP_BUILD_DIR)/bukubrow-darwin-x64
	cd $(TEMP_BUILD_DIR) && zip -r '../$(RELEASE_DIR)/binary-darwin-x64' ./*

# Build for Linux and zip into release dir
.PHONY: binary-linux-x64
binary-linux-x64:
	${MAKE} prepare-binary
	${MAKE} binary-linux-x64-build
	${MAKE} binary-linux-x64-bundle
	${MAKE} clean

# Build for macOS and zip into release dir
.PHONY: binary-darwin-x64
binary-darwin-x64:
	${MAKE} prepare-binary
	${MAKE} binary-darwin-x64-build
	${MAKE} binary-darwin-x64-bundle
	${MAKE} clean
