# The use of `${MAKE} target` is to allow the reuse of targets and also ensure
# explicit ordering
# If this can be improved (this is my first time with makefiles), feel free to
# submit an issue/PR

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
wipe:
	${MAKE} clean
	rm -rf release

# Copy all browser host configs to build dir as filenames expected by installer
.PHONY: browser-hosts
browser-hosts:
	cp $(WEBEXT_DIR)/_chrome/host.json $(BUILD_DIR)/chrome-host.json
	cp $(WEBEXT_DIR)/_firefox/host.json $(BUILD_DIR)/firefox-host.json

# Copy all platform-neutral webextension files to build dir
.PHONY: webext
webext:
	${MAKE} prepare
	cp -r `ls $(WEBEXT_DIR) | grep -v '_' | sed 's/^/$(WEBEXT_DIR)\//'` $(BUILD_DIR)
	cp -r assets $(BUILD_DIR)

# Copy web extension files to build dir and build into release dir
.PHONY: webext-release
webext-release:
	${MAKE} prepare
	${MAKE} webext
	cd $(BUILD_DIR) && zip -r '../$(RELEASE_DIR)/webext' ./*
	${MAKE} clean

# Copy Chrome files to build dir and build into release dir as a CRX/extension
.PHONY: chrome-crx
chrome-crx:
	${MAKE} prepare
	${MAKE} webext
	crxmake $(BUILD_DIR) ./key.pem
	mv .build.crx release/chrome.crx
	${MAKE} clean

# Build for Linux and zip into release dir
.PHONY: binary-linux-x64
binary-linux-x64:
	${MAKE} prepare
	${MAKE} browser-hosts
	env GOOS=linux GOARCH=amd64 go build -i binary/bukubrow.go
	mv bukubrow $(BUILD_DIR)/bukubrow-linux-x64
	cd $(BUILD_DIR) && zip -r '../$(RELEASE_DIR)/binary-linux-x64' ./* ../binary/install.sh
	${MAKE} clean

# Build for macOS and zip into release dir
.PHONY: binary-darwin-x64
binary-darwin-x64:
	${MAKE} prepare
	${MAKE} browser-hosts
	env GOOS=darwin GOARCH=amd64 go build -i binary/bukubrow.go
	mv bukubrow $(BUILD_DIR)/bukubrow-darwin-x64
	cd $(BUILD_DIR) && zip -r '../$(RELEASE_DIR)/binary-darwin-x64' ./* ../binary/install.sh
	${MAKE} clean

# Full release
.PHONY: release
release:
	${MAKE} webext-release
	${MAKE} binary-linux-x64
	${MAKE} binary-darwin-x64
