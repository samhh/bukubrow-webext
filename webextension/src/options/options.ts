import setTheme from '../modules/set-theme';
import sleep from 'Modules/sleep';

import '../global-styles/';
import './options.css';

interface Opts {
	theme: 'light' | 'dark';
}

console.log('Options JS loaded.');

const cfg = {
	defaultTheme: 'light',
};

const formEl = document.querySelector('.js-form') as HTMLFormElement;
const themeEl = document.querySelector('.js-form__theme') as HTMLSelectElement;
const submitEl = document.querySelector('.js-notice') as HTMLButtonElement;

const saveOpts = (opts: Opts): Promise<void> => new Promise((resolve, reject) => {
	chrome.storage.sync.set(opts, resolve);
});

const restoreOpts = (): Promise<Opts> => new Promise((resolve, reject) => {
	chrome.storage.sync.get(null, (data) => {
		resolve(data as Opts);
	});
});

const setOptsState = async (optsArg?: Opts) => {
	const opts = optsArg || await restoreOpts();

	if (!themeEl) return;

	themeEl.value = opts.theme || cfg.defaultTheme;
};

setTheme();
setOptsState();

let save = 0;

formEl.addEventListener('submit', (evt: Event) => {
	evt.preventDefault();

	const selectedOpts: Opts = {
		theme: themeEl.value as Opts['theme'],
	};

	saveOpts(selectedOpts).then(() => {
		setTheme();

		save++;
		const thisSave = save;

		const prevText = submitEl.textContent;

		submitEl.textContent = 'Saved!';

		sleep(4000)
			.then(() => {
				if (thisSave !== save) return;

				submitEl.textContent = prevText;
			});
	});
});
