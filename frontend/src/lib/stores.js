import { writable } from 'svelte/store';

// Store pour la couleur de fond du site
export const backgroundColor = writable('');

// Fonction pour appliquer la couleur de fond
export function applyBackgroundColor(color) {
	if (typeof document !== 'undefined') {
		document.body.style.backgroundColor = color || '';
		backgroundColor.set(color || '');
	}
} 