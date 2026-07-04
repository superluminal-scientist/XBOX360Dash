import { assetUrl } from '../assets.js';

export function render(state) {
	renderTabs(state);
	renderTray(state);
	renderProfile(state);
}

function renderTabs(state) {
	for (const button of document.querySelectorAll('[data-tab-key]')) {
		button.classList.toggle('selected', button.dataset.tabKey === state.currentTabKey);
	}
}

function renderTray(state) {
	const title = document.getElementById('tray-title');
	const cover = document.getElementById('tray-cover');
	title.textContent = state.tray?.title ?? 'Open Tray';
	const url = assetUrl(state.tray?.coverArtPath);
	cover.style.display = url ? 'block' : 'none';
	if (url && cover.src !== url) {
		cover.src = url;
	}
}

function renderProfile(state) {
	document.getElementById('profile-gamertag').textContent = state.profile?.gamertag ?? '';
	document.getElementById('profile-status').textContent = state.profile?.onlineStatus ?? '';
	const avatar = document.getElementById('profile-avatar');
	const url = assetUrl(state.profile?.gamerPicturePath);
	avatar.style.display = url ? 'block' : 'none';
	if (url && avatar.src !== url) {
		avatar.src = url;
	}
}
