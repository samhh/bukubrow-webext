SHELL := /usr/bin/env bash

# Vars
BUILD_DIR = .build
RELEASE_DIR = release
WEBEXT_DIR = webextension

# Prepare build and releases dirs
.PHONY: prepare
prepare:
	mkdir -p .build release

# Remove build dir
.PHONY: clean
clean:
	rm -rf .build

# Remove build and release dirs
.PHONY: wipe
wipe: clean
	rm -rf release

# Copy all browser policies to build dir as filenames expected by installer
.PHONY: browser-policies
browser-policies:
	cp $(WEBEXT_DIR)/_chrome/policy.json $(BUILD_DIR)/chrome-policy.json
	cp $(WEBEXT_DIR)/_chrome/host.json $(BUILD_DIR)/chrome-host.json
	cp $(WEBEXT_DIR)/_firefox/host.json $(BUILD_DIR)/firefox-host.json

# Copy all platform-neutral webextension files to build dir
.PHONY: webext
webext: prepare
	cp -r `ls $(WEBEXT_DIR) | grep -v "_" | sed 's/^/$(WEBEXT_DIR)\//'` $(BUILD_DIR)

# Copy Chrome files to build dir and build into release dir
.PHONY: chrome
chrome: prepare chrome-real clean

.PHONE: chrome-real
chrome-real: webext
	google-chrome --pack-extension=./webextension --pack-extension-key=./chrome-bukubrow.pem
	mv chrome.crx release/bukubrow-chrome.crx

# Copy Firefox files to build dir and zip into release dir
.PHONE: firefox
firefox: prepare firefox-real clean

.PHONY: firefox-real
firefox-real: webext
	zip -j '$(RELEASE_DIR)/firefox' $(BUILD_DIR)/*

# Build for Linux and zip into release dir
.PHONY: binary-linux-x64
binary-linux-x64: prepare binary-linux-x64 clean

.PHONY: binary-linux-x64-real
binary-linux-x64-real: browser-policies
	# env GOOS=linux GOARCH=amd64 go build -i binary/bukubrow.go
	# mv bukubrow $(BUILD_DIR)/bukubrow-linux-x64
	# zip -j "$(RELEASE_DIR)/binary-linux-x64" $(BUILD_DIR)/* binary/install.sh

# Build for macOS and zip into release dir
.PHONY: binary-darwin-x64
binary-darwin-x64: prepare binary-darwin-x64-real clean

.PHONY: binary-darwin-x64-real
binary-darwin-x64-real: browser-policies
	env GOOS=darwin GOARCH=amd64 go build -i binary/bukubrow.go
	mv bukubrow $(BUILD_DIR)/bukubrow-darwin-x64
	zip -j "$(RELEASE_DIR)/binary-darwin-x64" $(BUILD_DIR)/* binary/install.sh

# Full release
.PHONY: release
release: firefox chrome binary-linux-x64 binary-darwin-x64
