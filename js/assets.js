export function assetUrl(path) {
	if (!path) {
		return '';
	}
	const normalized = path.replace(/\\/g, '/');
	if (/^[A-Za-z]:|^\//.test(normalized)) {
		return '';
	}
	const relative = normalized.startsWith('Assets/') ? normalized.slice('Assets/'.length) : normalized;
	return 'assets/' + encodeURI(relative);
}
