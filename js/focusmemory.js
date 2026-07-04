export function createFocusMemory() {
	const byTab = new Map();
	return {
		remember(tabKey, tileId) {
			if (tabKey && tileId) {
				byTab.set(tabKey, tileId);
			}
		},
		recall(tabKey) {
			return byTab.get(tabKey) ?? null;
		}
	};
}
