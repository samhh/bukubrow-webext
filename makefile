# The use of `${MAKE} target` is to allow the reuse of targets and also ensure
# explicit ordering

SHELL := /usr/bin/env bash

# Vars
BUILD_DIR = dist
RELEASE_DIR = release
BUILD_FILES = entry/content.html entry/options.html entry/backend.js

# Copy assets to build dir
.PHONY: assets
assets:
	cp static/* $(BUILD_DIR)

# Remove everything in build dir
.PHONY: clean-build
clean-build:
	rm -rf $(BUILD_DIR)
	mkdir $(BUILD_DIR)

# Remove all build tool caches because they don't always behave well
.PHONY: purge-caches
purge-caches:
	rm -rf .spago/ output/ .parcel-cache/

# Remove everything that's not source code (same as contents of gitignore)
.PHONY: stateless
stateless:
	${MAKE} purge-caches
	rm -rf node_modules/ $(BUILD_DIR) $(RELEASE_DIR)

# Bundle and watch for dev, leaving alone secondary tasks
.PHONY: bundle-dev
bundle-dev:
	echo 'Remember to':
	echo '1. Install dependencies with Yarn'
	echo '2. Run a build with Spago'
	${MAKE} clean-build
	${MAKE} assets
	./node_modules/.bin/parcel watch $(BUILD_FILES)

# Bundle for prod, handling all dependent tasks
.PHONY: bundle-prod
bundle-prod:
	${MAKE} purge-caches
	yarn install
	${MAKE} clean-build
	${MAKE} assets
	spago build
	./node_modules/.bin/parcel build $(BUILD_FILES)

# Build and zip into release dir
.PHONY: release
release:
	mkdir -p $(RELEASE_DIR)
	${MAKE} bundle-prod
	cd $(BUILD_DIR)
	zip -r '../$(RELEASE_DIR)/webext' ./*

