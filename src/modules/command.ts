import { browser } from 'webextension-polyfill-ts';

export enum Command {
	AddBookmark = 'add_bookmark',
	StageAllTabs = 'stage_all_tabs',
	StageWindowTabs = 'stage_window_tabs',
	StageActiveTab = 'stage_active_tab',
}

export const listenForCommands = (f: (c: string) => void): IO<void> => (): void => {
	browser.commands.onCommand.addListener(f);
};

