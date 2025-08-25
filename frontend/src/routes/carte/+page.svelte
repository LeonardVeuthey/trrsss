<script>
  import Carte from '../../components/Carte.svelte';
  import SEO from '../../components/SEO.svelte';
  export let data;
  
  console.log('📄 Carte page - data received:', data);
  console.log('📄 Carte page - data.projets:', data.projets);
</script>

<SEO 
	title={data?.site?.seo_carte_metatitle || 'Carte - Territoires Sensibles'}
	description={data?.site?.seo_carte_metadescription || ''}
	favicon={data?.site?.seo_favicon?.url || ''}
/>

<div class="carte-page">
  <Carte />
</div>

<style lang="scss">
@use '../../styles/_variables.scss' as *;

.carte-page {
  width: 100%;
  height: 100vh;
  position: relative;
  .leaflet-map {
    width: 100vw;
    height: 100vh;
  }
}
</style> 