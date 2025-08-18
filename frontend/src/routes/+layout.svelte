<script>
	import '../app.css';
	import '../styles/_global.scss';
	import '../styles/_layout.scss';
	import '../styles/_components.scss';
	import Navbar from '../components/Navbar.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { applyBackgroundColor } from '$lib/stores.js';
	
	// Récupérer les données du site depuis le layout server
	export let data;
	
	onMount(() => {
		// Appliquer la couleur de fond au body
		if (data?.site?.color_hex) {
			applyBackgroundColor(data.site.color_hex);
		}
	});
	
	// Réactif pour appliquer la couleur quand les données changent
	$: if (data?.site?.color_hex) {
		applyBackgroundColor(data.site.color_hex);
	}
	
	// Nettoyer le style quand le composant est détruit
	onDestroy(() => {
		applyBackgroundColor('');
	});
</script>

<Navbar />
<main>
	<slot />
</main>
