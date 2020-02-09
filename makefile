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

# Wipe, and also remove node_modules/ and any cache directories
.PHONY: nuke
nuke:
	${MAKE} wipe
	rm -rf node_modules/ .cache/ dist/


# Build WebExtension via Yarn and zip into release dir
.PHONY: webext
webext:
	${MAKE} prepare
	yarn && yarn build
	cd dist && zip -r '../$(RELEASE_DIR)/webext' ./*
	${MAKE} clean
