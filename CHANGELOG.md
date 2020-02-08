# Change Log
This project is versioned according to its compatibility with the [host](https://github.com/SamHH/bukubrow-host) from v4 onwards.

## [5.0.0.3] - 2020-02-08
### Changed
- Fix opening multiple bookmarks in Chromium-based browsers.

## [5.0.0.2] - 2019-06-15
### Changed
- Fix race condition in Firefox where browser popup will close before it can open requested bookmarks.

## [5.0.0.1] - 2019-06-15
### Added
- Support for very large Buku databases that serialise to over 1MB in size.
- Settings option to configure the WebExtension's badge.

### Changed
- Bookmarks will now attempt to open in your active tab if it's a new tab page.

## [4.0.0.1] - 2019-05-04
### Changed
- Versioning has been changed to move in tandem with the [host](https://github.com/SamHH/bukubrow-host).

## [3.0.0] - 2019-04-28
### Added
- Send browser tabs to a "staging area" via context menu, wherein they can be easily edited and added to Buku(brow).

### Changed
- Removed fetch bookmarks button. They are now implictly fetched from the binary frequently - on load and upon any change.
- Improved keyboard navigation in bookmark form.
- Improved overflow behaviour of text in listed bookmarks.
- Fixed ability to try and add a bookmark without communication with the binary having been achieved.

## [2.6.0] - 2019-03-03
### Added
- Browser action (WebExtension toolbar icon) displays a badge based upon whether a bookmark with the exact URL or domain of the active tab is present, differentiated by colour.
- Pin bookmarks whose URLs match the active tab at the top of the bookmarks list.

### Changed
- Fixed regression that broke padding for bookmarks with no description.

## [2.5.5] - 2019-02-24
### Changed
- Fixed regression that mislabelled add/edit bookmark modals.
- Fixed button tooltip positioning in bookmarks.

## [2.5.4] - 2019-02-12
### Changed
- Fixed regression that prevented new bookmarks from being saved in some browsers.

## [2.5.3] - 2019-02-12
### Changed
- Fixed regression that prevented search input from auto-focusing on load.

## [2.5.2] - 2019-02-11
### Changed
- Fixed regression that prevented bookmark opening.

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
