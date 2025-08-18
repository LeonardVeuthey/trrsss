<script>
  import Carte from '../../components/Carte.svelte';
  export let data;
  
  console.log('📄 Carte page - data received:', data);
  console.log('📄 Carte page - data.projets:', data.projets);
</script>

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