export function nextFocus(rects, currentId, direction) {
	const current = rects.find((r) => r.id === currentId);
	if (!current) {
		return rects.length > 0 ? rects[0].id : null;
	}
	const cx = current.x + current.w / 2;
	const cy = current.y + current.h / 2;
	let best = null;
	let bestScore = Infinity;
	for (const rect of rects) {
		if (rect.id === currentId) {
			continue;
		}
		const dx = rect.x + rect.w / 2 - cx;
		const dy = rect.y + rect.h / 2 - cy;
		let primary;
		let secondary;
		if (direction === 'left') { primary = -dx; secondary = Math.abs(dy); }
		else if (direction === 'right') { primary = dx; secondary = Math.abs(dy); }
		else if (direction === 'up') { primary = -dy; secondary = Math.abs(dx); }
		else { primary = dy; secondary = Math.abs(dx); }
		if (primary <= 1) {
			continue;
		}
		const score = primary + secondary * 2;
		if (score < bestScore) {
			bestScore = score;
			best = rect;
		}
	}
	return best ? best.id : currentId;
}
