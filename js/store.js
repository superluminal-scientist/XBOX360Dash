export function createStore() {
	let state = null;
	const listeners = [];

	function apply(message) {
		if (!message || typeof message !== 'object') {
			return;
		}
		if (message.type === 'snapshot') {
			state = message.state;
		} else if (message.type === 'patch' && state) {
			Object.assign(state, message.state);
		} else {
			return;
		}
		for (const listener of listeners) {
			listener(state);
		}
	}

	return {
		apply,
		getState: () => state,
		subscribe(listener) {
			listeners.push(listener);
		}
	};
}
