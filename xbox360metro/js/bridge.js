const TABS = [
	{ key: 'bing', name: 'bing' },
	{ key: 'home', name: 'home' },
	{ key: 'social', name: 'social' },
	{ key: 'media', name: 'video' },
	{ key: 'games', name: 'games' },
	{ key: 'music', name: 'music' },
	{ key: 'apps', name: 'apps' },
	{ key: 'settings', name: 'settings' }
];

const SOUND_FILES = {
	'startup': '02. Startup (2010).mp3',
	'page-left': '08. Page Left.mp3',
	'page-right': '09. Page Right.mp3',
	'tab': '09. Page Right.mp3',
	'select': '10. Select A.mp3',
	'activate': '10. Select A.mp3',
	'back': '14. Back.mp3',
	'focus': '13. Select.mp3'
};

const state = {
	tabs: TABS,
	currentTabKey: 'home',
	tray: { title: 'Open Tray', coverArtPath: '' },
	profile: { gamertag: 'Player One', onlineStatus: 'Online', gamerPicturePath: '' }
};

let messageHandler = null;
const audioCache = new Map();

function emit(message) {
	if (messageHandler) {
		setTimeout(() => messageHandler(message), 15);
	}
}

function playSound(name) {
	const file = SOUND_FILES[name];
	if (!file) {
		return;
	}
	let audio = audioCache.get(name);
	if (!audio) {
		audio = new Audio('assets/Audio/Sounds/' + encodeURI(file));
		audioCache.set(name, audio);
	}
	audio.currentTime = 0;
	audio.play().catch(() => {});
}

function setTab(key, sound) {
	if (!TABS.some((t) => t.key === key) || key === state.currentTabKey) {
		return;
	}
	state.currentTabKey = key;
	playSound(sound);
	emit({ type: 'patch', state: { currentTabKey: key } });
}

export function onMessage(handler) {
	messageHandler = handler;
	emit({ type: 'snapshot', state: { ...state } });
}

export function sendCommand(name, arg) {
	switch (name) {
	case 'switchTab':
		setTab(arg, 'tab');
		break;
	case 'moveTab': {
		const i = TABS.findIndex((t) => t.key === state.currentTabKey);
		const next = Math.min(Math.max(i + arg, 0), TABS.length - 1);
		if (next !== i) {
			setTab(TABS[next].key, arg < 0 ? 'page-left' : 'page-right');
		}
		break;
	}
	case 'playSound':
		playSound(arg);
		break;
	case 'toggleFullscreen':
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen().catch(() => {});
		}
		break;
	case 'launchTrayGame':
		break;
	}
}
