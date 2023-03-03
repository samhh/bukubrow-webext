# The use of `${MAKE} target` is to allow the reuse of targets and also ensure
# explicit ordering

SHELL := /usr/bin/env bash

# Vars
TEMP_BUILD_DIR = .build
TEMP_CLONE_DIR = .clone
RELEASE_DIR = release

# Prepare temp and release dirs
.PHONY: prepare
prepare:
	mkdir -p $(TEMP_BUILD_DIR) $(TEMP_CLONE_DIR) $(RELEASE_DIR)

# Remove temp dirs
.PHONY: clean
clean:
	rm -rf $(TEMP_BUILD_DIR) $(TEMP_CLONE_DIR)

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
	rm -f '$(RELEASE_DIR)/webext.zip'
	cd dist && zip -r '../$(RELEASE_DIR)/webext' ./*
	${MAKE} clean

# Produce a zip of the source code for the Firefox Addon Store
.PHONY: webext-src
webext-src:
	${MAKE} prepare
	git clone git@github.com:samhh/bukubrow-webext.git $(TEMP_CLONE_DIR)
	zip -r $(RELEASE_DIR)/bukubrow-src $(TEMP_CLONE_DIR)/*
	${MAKE} clean
