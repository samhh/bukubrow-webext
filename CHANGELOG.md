# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] - 2017-12-13
### Changed
- Rewritten binary to make new features possible.

## [1.1.1] - 2017-05-31
### Changed
- Don't change case sensitivity of matched text when filtering bookmarks.
- New refresh icon and accompanying rotate animation.
- Fixed multiple severe issues unique to Firefox:
	- Startup error.
	- Not autofocusing.
	- No preferences.
	- Popup window not closing upon opening a bookmark.
	- Styling incl/ the refresh icon.

## [1.1.0] - 2017-05-08
### Added
- Much improved UI layout with more useful information.
- Highlight the filter text wherever it matches.
- User-visible error messages.
- Basic tutorial message for new users.

### Changed
- Filtering will now filter based upon four fields, in this order: name, tags, URL, description.
- Fixed URL validity checker.
- Minimum Chrome & Firefox versions (for async/await).
- Misc bugs and QOL improvements.

## [1.0.2] - 2017-04-28
### Added
- Ability to select bookmarks with the up/down arrow keys.
- Options page with a light/dark theme option.
- Icon to extension list.
- Changelog.

### Changed
- Minimum Chrome version (for CSS Custom Properties).
