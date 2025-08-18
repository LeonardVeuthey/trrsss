<script>
	export let data;
	
	// Debug: afficher la structure des données
	console.log('🔍 Home page - data received:', data);
	console.log('🔍 Home page - data.accueil:', data.accueil);
	console.log('🔍 Home page - data.accueil?.Video:', data.accueil?.Video);
	console.log('🔍 Home page - data.accueil keys:', Object.keys(data.accueil || {}));
	
	// Debug détaillé pour la vidéo
	if (data.accueil?.Video) {
		console.log('🔍 Home page - Video structure:', data.accueil.Video);
		console.log('🔍 Home page - Video.data:', data.accueil.Video.data);
		if (data.accueil.Video.data && data.accueil.Video.data.length > 0) {
			console.log('🔍 Home page - First video:', data.accueil.Video.data[0]);
			console.log('🔍 Home page - First video attributes:', data.accueil.Video.data[0].attributes);
		}
	}
</script>

<div class="home-hero">
  <!-- Fond vidéo ou image -->
  {#if data.accueil?.Video?.[0]?.url}
    <video autoplay muted loop class="video">
      <source src={data.accueil.Video[0].url} type="video/mp4" />
    </video>
  {:else}
    <!-- Fallback si pas de vidéo -->
    <div class="video-placeholder">
      <h1>Territoires Sensibles</h1>
      <p>Bienvenue sur notre site</p>
    </div>
  {/if}
  <div class="home-bg"></div>
</div>

<style lang="scss">
@use '../styles/_variables.scss' as *;
@use '../styles/_global.scss' as *;
@use '../styles/_layout.scss' as *;
@use '../styles/_components.scss' as *;


.home-hero {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  
  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  p {
    font-size: 1.2rem;
    opacity: 0.9;
  }
}
</style>
