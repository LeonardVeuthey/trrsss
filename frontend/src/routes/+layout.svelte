<script>
	import '../app.css';
	import '../styles/_global.scss';
	import '../styles/_layout.scss';
	import '../styles/_components.scss';
	import Navbar from '../components/Navbar.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { applyBackgroundColor } from '$lib/stores.js';
	import { isAuthenticated, requireAuth } from '$lib/auth.js';
	import { page } from '$app/stores';
	
	// Récupérer les données du site depuis le layout server
	export let data;
	
	onMount(() => {
		// Appliquer la couleur de fond au body
		if (data?.site?.color_hex) {
			applyBackgroundColor(data.site.color_hex);
		}
		
		// Vérifier l'authentification pour toutes les pages sauf /auth
		if ($page.url.pathname !== '/auth' && !isAuthenticated()) {
			requireAuth();
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

{#if $page.url.pathname === '/auth'}
	<slot />
{:else if isAuthenticated()}
	<Navbar />
	<main>
		<slot />
	</main>
{:else}
	<!-- Redirection en cours... -->
{/if}
