export function showSection(key) {
	for (const section of document.querySelectorAll('.tab-section')) {
		section.classList.toggle('active', section.id === key + '-view');
	}
}

export function defaultFocusId(key) {
	if (key === 'home') {
		return 'tile-pins';
	}
	const section = document.getElementById(key + '-view');
	return section?.querySelector('[data-focusable]')?.id ?? null;
}
