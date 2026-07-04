import { nextFocus } from './focus.js';
import { sendCommand } from './bridge.js';
import { createFocusMemory } from './focusmemory.js';

const DIRECTIONS = { MoveLeft: 'left', MoveRight: 'right', MoveUp: 'up', MoveDown: 'down' };

const KEY_ACTIONS = {
	ArrowLeft: 'MoveLeft', a: 'MoveLeft',
	ArrowRight: 'MoveRight', d: 'MoveRight',
	ArrowUp: 'MoveUp', w: 'MoveUp',
	ArrowDown: 'MoveDown', s: 'MoveDown',
	Enter: 'Activate', ' ': 'Activate',
	q: 'PreviousTab', PageUp: 'PreviousTab',
	e: 'NextTab', PageDown: 'NextTab'
};

const memory = createFocusMemory();

let focusedId = null;

function activeSection(state) {
	return document.getElementById((state?.currentTabKey ?? '') + '-view');
}

function focusables(state) {
	const section = activeSection(state);
	if (!section) {
		return [];
	}
	return [...section.querySelectorAll('[data-focusable]')]
		.filter((el) => el.offsetParent !== null);
}

function rectOf(el) {
	const r = el.getBoundingClientRect();
	return { id: el.id, x: r.left, y: r.top, w: r.width, h: r.height };
}

export function setFocus(id) {
	focusedId = id;
	for (const el of document.querySelectorAll('.tab-section [data-focusable]')) {
		el.classList.toggle('focused', el.id === id);
	}
}

export function recallFocus(tabKey) {
	return memory.recall(tabKey);
}

export function handleAction(action, state) {
	const direction = DIRECTIONS[action];
	if (direction) {
		const candidates = focusables(state).map(rectOf);
		const next = nextFocus(candidates, focusedId, direction);
		if (next === null || next === focusedId) {
			if (direction === 'left') {
				sendCommand('moveTab', -1);
				return 'page:-1 (from ' + focusedId + ', ' + candidates.length + ' candidates)';
			}
			if (direction === 'right') {
				sendCommand('moveTab', 1);
				return 'page:+1 (from ' + focusedId + ', ' + candidates.length + ' candidates)';
			}
			return 'edge-noop (' + direction + ' from ' + focusedId + ')';
		}
		setFocus(next);
		memory.remember(state.currentTabKey, next);
		sendCommand('playSound', 'focus');
		return 'focus:' + next;
	}
	if (action === 'Activate') {
		const el = focusedId ? document.getElementById(focusedId) : null;
		if (el && activeSection(state)?.contains(el)) {
			el.click();
			return 'activate:' + focusedId;
		}
		return 'activate-skipped';
	}
	if (action === 'PreviousTab') {
		sendCommand('moveTab', -1);
		return 'page:-1 (bumper)';
	}
	if (action === 'NextTab') {
		sendCommand('moveTab', 1);
		return 'page:+1 (bumper)';
	}
	return 'unhandled';
}

export function installKeyboard(dispatch) {
	document.addEventListener('keydown', (e) => {
		if (e.key === 'F11') {
			sendCommand('toggleFullscreen');
			e.preventDefault();
			return;
		}
		const action = KEY_ACTIONS[e.key];
		if (action) {
			dispatch(action);
			e.preventDefault();
		}
	});
}
