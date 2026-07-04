import { cloneForDisplay } from './previews.js';

let transitioning = false;

export function isTransitioning() {
	return transitioning;
}

export function runTabSlide(oldKey, newKey, direction, onSettled) {
	const content = document.querySelector('.content');
	const oldSection = document.getElementById(oldKey + '-view');
	const newSection = document.getElementById(newKey + '-view');
	if (!content || !oldSection || !newSection) {
		onSettled();
		return;
	}
	transitioning = true;
	const strip = document.createElement('div');
	strip.className = 'transition-strip';
	strip.appendChild(makePanel(oldSection, 0));
	strip.appendChild(makePanel(newSection, direction > 0 ? 1280 : -1280));
	for (const section of document.querySelectorAll('.tab-section')) {
		section.classList.remove('active');
	}
	content.appendChild(strip);
	nudgePreviews(direction);
	strip.getBoundingClientRect();
	strip.style.transform = 'translateX(' + (direction > 0 ? -1280 : 1280) + 'px)';
	let settled = false;
	const settle = () => {
		if (settled) {
			return;
		}
		settled = true;
		transitioning = false;
		strip.remove();
		onSettled();
	};
	strip.addEventListener('transitionend', settle, { once: true });
	setTimeout(settle, 500);
}

function makePanel(section, left) {
	const panel = document.createElement('div');
	panel.className = 'transition-panel';
	panel.style.left = left + 'px';
	panel.appendChild(cloneForDisplay(section));
	return panel;
}

function nudgePreviews(direction) {
	const nudges = [
		[document.getElementById('preview-left'), direction > 0 ? 18 : 10],
		[document.getElementById('preview-right'), direction > 0 ? 10 : -8]
	];
	for (const [sliver, offset] of nudges) {
		if (!sliver) {
			continue;
		}
		sliver.style.transition = 'none';
		sliver.style.transform = 'translateX(' + offset + 'px)';
		sliver.style.opacity = '0.3';
		sliver.getBoundingClientRect();
		sliver.style.transition =
			'transform 385ms cubic-bezier(0.33, 1, 0.68, 1), opacity 385ms ease-in-out';
		sliver.style.transform = 'translateX(0)';
		sliver.style.opacity = '0.36';
	}
}
