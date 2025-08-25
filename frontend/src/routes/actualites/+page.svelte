<script>
  import SEO from '../../components/SEO.svelte';
  export let data;
  
  // Debug: afficher la structure des données
  console.log('🔍 Actualites data:', data);
  if (data.actualitees && data.actualitees.length > 0) {
    console.log('🔍 First actualite:', data.actualitees[0]);
  }
  
  // Fonction pour formater la date
  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  
  // Fonction pour extraire le texte des blocks de description
  function extractTextFromBlocks(blocks) {
    if (!blocks || !Array.isArray(blocks)) return '';
    
    console.log('🔍 Processing blocks:', blocks);
    
    return blocks.map(block => {
      if (block.type === 'paragraph' && block.children) {
        return block.children.map(child => child.text || '').join('');
      }
      return '';
    }).join(' ').trim();
  }
</script>

<SEO 
	title={data?.site?.seo_actualites_metatitle || 'Actualités - Territoires Sensibles'}
	description={data?.site?.seo_actualites_metadescription || ''}
	favicon={data?.site?.seo_favicon?.url || ''}
/>
  
  <main>
    <div class="actualites">
      {#if data.actualitees && data.actualitees.length > 0}
        {#each data.actualitees as actualite (actualite.id)}
          <article class="actualite_card">
            <div class="actualite_image">
              {#if actualite.image}
              <img src={actualite.image.url?.startsWith('/') ? `http://localhost:1337${actualite.image.url}` : actualite.image.url} alt={actualite.titre} />
              {:else}
                <div class="image-placeholder">
                  <span>📰</span>
                </div>
              {/if}
            </div>
            
            <div class="actualite_content">
              <div class="actualite_meta">
                {#if actualite.date}
                  <time class="actualite_date" datetime={actualite.date}>
                    {formatDate(actualite.date)}
                  </time>
                {/if}
                {#if actualite.titre}
                  <h2 class="actualite_title">{actualite.titre}</h2>
                {/if}
              </div>
              
              {#if actualite.texte}
                <p class="actualite_description">
                  {extractTextFromBlocks(actualite.texte)}
                </p>
              {/if}
              
              {#if actualite.lien}
                <a href={actualite.lien} class="actualite_link" target="_blank" rel="noopener noreferrer">
                  <p>{actualite.nom_bouton}</p>
                </a>
              {/if}
            </div>
          </article>
        {/each}
      {:else}
        <div class="no_actualite">
          <p>Aucune actualité trouvée.</p>
        </div>
      {/if}
    </div>
  </main>


<style lang="scss">
@use '../../styles/_normalize.scss' as *;
@use '../../styles/_variables.scss' as *;
@use '../../styles/_components.scss' as *;      
@use '../../styles/_global.scss' as *;


.actualites {
  max-width: 1920px;
  margin: 180px auto 180px 0;
  display: flex;
  flex-direction: column;
  padding: 0 30px;
}

.actualite_card {
  display: flex;
  flex-direction: row;
  min-height: 320px;
  align-items: stretch;
  margin-bottom: 120px;
}

.actualite_image {
  width: 33.33%;
  height: 20vw;
  max-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ededed;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }
  
  .image-placeholder {
    width: 100%;
    height: 100%;
  }
}

.actualite_content {
  width: 66.66%;
  padding-left: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
}

  .actualite_meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  
  .actualite_date {
    font-size: $font-size-lg;
    font-weight: 400;
  }
  
  .actualite_title {
    font-size: $font-size-lg;

    margin-left: auto;
    margin-right: 0;
    white-space: nowrap;
  }
}

.actualite_description {
  font-size: $font-size-md;
  font-weight: 400;
}

.actualite_link {
  display: inline-block;
  border: 2px solid $color-primary;
  color: $color-primary;
  border-radius: 999px;
  padding: 10px 30px;
  font-size: $font-size-md;
  font-weight: 500;
  text-decoration: none;
  margin-top: 16px;
  transition: background 0.2s, color 0.2s;
  align-self: flex-start;
  
  &:hover {
    background: #1a23b8;
    color: #fff;

    p {
      color: #fff;
    }
  }
}

.no_actualite {
  text-align: center;
  padding: 80px 20px;
  color: #666;
  font-size: 24px;
}

@media (max-width: 991px) {

  .actualite_card {
    flex-direction: column;
    align-items: flex-start;

  }
  .actualite_image {
    width: 100%;
    margin-bottom: 30px;
    height: 50vw;
    max-height: none;
  }
  .actualite_content {
    width: 100%;
    padding-left: 0;
  }
}

@media (max-width: 768px) {
  .actualites-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 24px 8px 0 8px;
    
    .header-right {
      gap: 16px;
      
      .page-title {
        font-size: 20px;
      }
      
      .burger {
        width: 32px;
        height: 32px;
        
        span { 
          height: 3px; 
        }
      }
    }
    
    .logo { 
      height: 36px; 
    }
  }
  
  .actualites {
    gap: 32px;
    padding: 0 8px 24px 8px;
  }
  
  .actualite_card {
    flex-direction: column;
    min-height: unset;
  }
  
  .actualite_image {
    max-width: 100%;
    min-height: 180px;

  }
  
  .actualite_content {
    padding: 20px 8px;
    gap: 12px;
  }
  
  .actualite_meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    
    .actualite_date { 
      font-size: $font-size-sm; 
    }
    
    .actualite_title { 
      margin: 0; 
      white-space: normal;
    }
  }
  
  .actualite_description { 
    font-size: $font-size-sm; 
  }
  
  .actualite_link { 
    font-size: 16px; 
    padding: 8px 20px; 
  }
}
</style> 