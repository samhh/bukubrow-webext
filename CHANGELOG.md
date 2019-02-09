# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.5.1] - 2019-02-09
### Changed
- Fixed results text not being highlighted if the search terms overlap.
- Fixed tutorial not closing upon successfully fetching bookmarks on first load.
- Disabled unusable action buttons during tutorial.
- Disabled text input completely during tutorial.

## [2.5.0] - 2019-01-30
### Added
- Input filtering with tokens in the search input.
- Hotkeys for search control bar buttons.
- Hotkey for focusing search input.
- Confirmation modal when opening all bookmarks.

### Changed
- Fixed button tooltips going crazy when buttons are active.
- Hopefully fixed some sporadic issues, usually focused around tags.
- Improved error messages.

## [2.4.2] - 2018-10-14
### Changed
- Fixed tags not adhering correctly to Buku's schema.
- Fixed some styling issues in Firefox.

## [2.4.1] - 2018-07-04
### Changed
- Fixed some fields being immutable for new bookmarks.

## [2.4.0] - 2018-06-21
### Added
- Autofill active tab title for new bookmark form like URL was previously.
- Number of matches is now displayed in tooltip when hovering "Open All Matches" button.

### Changed
- Browser action shortcut to Ctrl+Shift+B.
- Added a minimum height to entire UI frame to fix bookmark form being unusable.

## [2.3.0] - 2018-04-19
### Added
- Functionality to add a bookmark.
- Functionality to edit a bookmark.
- Functionality to delete a bookmark.

## [2.2.0] - 2018-01-14
### Added
- Tooltip to buttons in search bar. (Thanks [andipabst](https://github.com/andipabst)!)

### Changed
- Fixed various styling inconsistencies in Firefox.

## [2.1.0] - 2017-12-14
### Added
- Button to open all bookmarks in search bar.

### Changed
- Search bar to be fixed to the top of the UI.
- UI to scroll with you if you use keyboard navigation and start scrolling off-screen.

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
