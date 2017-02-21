SHELL := /usr/bin/env bash

.PHONY: empty
empty:

.PHONY: chrome
chrome:
	google-chrome --pack-extension=./webextension --pack-extension-key=./chrome-bukubrow.pem
	mv chrome.crx release/bukubrow-chrome.crx

.PHONY: static-files
static-files: webextension/_chrome/host.json webextension/_firefox/host.json
	cp webextension/_chrome/host.json .build/chrome-host.json
	cp webextension/_firefox/host.json .build/firefox-host.json
	cp webextension/_chrome/policy.json .build/chrome-policy.json

.PHONY: binary-linux-x64
binary-linux-x64: binary/bukubrow.go
	env GOOS=linux GOARCH=amd64 go build -i binary/bukubrow.go
	mv bukubrow .build/bukubrow-linux-x64

.PHONY: binary-darwin-x64
binary-darwin-x64: binary/bukubrow.go
	env GOOS=darwin GOARCH=amd64 go build -i binary/bukubrow.go
	mv bukubrow .build/bukubrow-darwin-x64

.PHONY: clean
clean:
	rm -r .build

.PHONY: wipe clean
wipe: clean
	rm -r release

.PHONY: static-files chrome binary-linux-x64 binary-darwin-x64 clean
release: static-files chrome binary-linux-x64 binary-darwin-x64 clean
	mkdir -p release
	zip -jFS "release/chrome" chrome/* chrome-bukubrow.crx
	zip -jFS "release/firefox" firefox/*
	zip -FS "release/bukubrow-linux-x64" bukubrow-linux-x64 .build/*-host.json chrome-bukubrow.crx install.sh chrome-policy.json README.md LICENSE
	zip -FS "release/bukubrow-darwin-x64" bukubrow-darwin-x64 .build/*-host.json chrome-bukubrow.crx install.sh README.md LICENSE
