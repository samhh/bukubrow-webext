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
	cd webextension && npm run build
	cd webextension/dist && zip -r '../../$(RELEASE_DIR)/webext' ./*
	${MAKE} clean

# Copy files over to build dir as expected by binary
.PHONY: prepare-binary
prepare-binary:
	${MAKE} prepare
	cp binary/browser-hosts/chrome.json $(TEMP_BUILD_DIR)/chrome-host.json
	cp binary/browser-hosts/firefox.json $(TEMP_BUILD_DIR)/firefox-host.json
	cp binary/install.sh $(TEMP_BUILD_DIR)/

# Build for Linux and zip into release dir
.PHONY: binary-linux-x64
binary-linux-x64:
	${MAKE} prepare-binary
	env GOOS=linux GOARCH=amd64 go build -i binary/bukubrow.go
	mv bukubrow $(TEMP_BUILD_DIR)/bukubrow-linux-x64
	cd $(TEMP_BUILD_DIR) && zip -r '../$(RELEASE_DIR)/binary-linux-x64' ./*
	${MAKE} clean

# Build for macOS and zip into release dir
.PHONY: binary-darwin-x64
binary-darwin-x64:
	${MAKE} prepare-binary
	env GOOS=darwin GOARCH=amd64 go build -i binary/bukubrow.go
	mv bukubrow $(TEMP_BUILD_DIR)/bukubrow-darwin-x64
	cd $(TEMP_BUILD_DIR) && zip -r '../$(RELEASE_DIR)/binary-darwin-x64' ./*
	${MAKE} clean

# Full release
.PHONY: release
release:
	${MAKE} webext
	${MAKE} binary-linux-x64
	${MAKE} binary-darwin-x64
