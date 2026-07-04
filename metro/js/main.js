import { onMessage, sendCommand } from './bridge.js';
import { createStore } from './store.js';
import { render } from './views/home.js';
import { handleAction, installKeyboard, setFocus, recallFocus } from './input.js';
import { showSection, defaultFocusId } from './sections.js';
import { refreshPreviews } from './previews.js';
import { runTabSlide, isTransitioning } from './transition.js';

const store = createStore();
let renderedTabKey = null;
let queuedTabStep = 0;

store.subscribe(render);
store.subscribe((state) => {
	const key = state.currentTabKey;
	if (!key || key === renderedTabKey) {
		return;
	}
	if (renderedTabKey === null) {
		renderedTabKey = key;
		settleOn(key);
		return;
	}
	if (isTransitioning()) {
		return;
	}
	startSlide(key, state);
});

function startSlide(key, state) {
	const previous = renderedTabKey;
	renderedTabKey = key;
	const direction = tabIndex(state, key) >= tabIndex(state, previous) ? 1 : -1;
	runTabSlide(previous, key, direction, () => {
		settleOn(key);
		const latest = store.getState();
		if (latest.currentTabKey && latest.currentTabKey !== renderedTabKey) {
			startSlide(latest.currentTabKey, latest);
			return;
		}
		if (queuedTabStep !== 0) {
			const step = queuedTabStep;
			queuedTabStep = 0;
			sendCommand('moveTab', step);
		}
	});
}

function tabIndex(state, key) {
	return (state.tabs || []).findIndex((t) => t.key === key);
}

function settleOn(key) {
	showSection(key);
	setFocus(recallFocus(key) ?? defaultFocusId(key));
	refreshPreviews(store.getState());
}

function onInput(action) {
	if (isTransitioning()) {
		if (action === 'MoveLeft' || action === 'PreviousTab') {
			queuedTabStep = -1;
		} else if (action === 'MoveRight' || action === 'NextTab') {
			queuedTabStep = 1;
		}
		return;
	}
	const state = store.getState();
	if (state) {
		handleAction(action, state);
	}
}

onMessage((message) => {
	if (message?.type === 'input') {
		onInput(message.action);
		return;
	}
	store.apply(message);
});

installKeyboard(onInput);

for (const button of document.querySelectorAll('[data-tab-key]')) {
	button.addEventListener('click', () => sendCommand('switchTab', button.dataset.tabKey));
}
document.getElementById('tile-tray').addEventListener('click', () => sendCommand('launchTrayGame'));
