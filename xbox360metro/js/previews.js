export function leftPreviewOffset(currentKey) {
	return currentKey === 'settings' ? -938 : -910;
}

export function rightPreviewOffset(currentKey) {
	return (currentKey === 'bing' || currentKey === 'home') ? -198 : -240;
}

export function adjacentKeys(tabs, currentKey) {
	const list = tabs || [];
	const i = list.findIndex((t) => t.key === currentKey);
	return {
		prevKey: i > 0 ? list[i - 1].key : null,
		nextKey: (i >= 0 && i < list.length - 1) ? list[i + 1].key : null
	};
}

export function cloneForDisplay(section) {
	const clone = section.cloneNode(true);
	clone.classList.add('active');
	clone.removeAttribute('id');
	for (const el of clone.querySelectorAll('[id]')) {
		el.removeAttribute('id');
	}
	for (const el of clone.querySelectorAll('[data-focusable]')) {
		el.removeAttribute('data-focusable');
	}
	for (const el of clone.querySelectorAll('.focused')) {
		el.classList.remove('focused');
	}
	return clone;
}

export function refreshPreviews(state) {
	const { prevKey, nextKey } = adjacentKeys(state.tabs, state.currentTabKey);
	fill(document.getElementById('preview-left'), prevKey, leftPreviewOffset(state.currentTabKey));
	fill(document.getElementById('preview-right'), nextKey, rightPreviewOffset(state.currentTabKey));
}

function fill(sliver, key, offset) {
	if (!sliver) {
		return;
	}
	sliver.textContent = '';
	if (!key) {
		return;
	}
	const section = document.getElementById(key + '-view');
	if (!section) {
		return;
	}
	const holder = document.createElement('div');
	holder.className = 'preview-content';
	holder.style.left = offset + 'px';
	holder.appendChild(cloneForDisplay(section));
	sliver.appendChild(holder);
}
