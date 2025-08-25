<script>
  import Slider from '../../../components/Slider.svelte';
  import SEO from '../../../components/SEO.svelte';
  export let data;
  
  console.log('📄 Projet detail page - data received:', data);
  console.log('📄 Projet detail page - data.project:', data.project);
  
  // Fonction pour rendre les blocs de contenu Strapi
  function renderBlocks(blocks) {
    if (!blocks || !Array.isArray(blocks)) return '';
    
    return blocks.map(block => {
      if (block.type === 'paragraph' && block.children) {
        return block.children.map(child => child.text || '').join('');
      }
      return '';
    }).join(' ');
  }
  
  // Fonction pour extraire le texte de la description
  function extractDescriptionText(blocks) {
    if (!blocks || !Array.isArray(blocks)) return '';
    
    return blocks.map(block => {
      if (block.type === 'paragraph' && block.children) {
        return block.children.map(child => child.text || '').join('');
      }
      return '';
    }).join(' ').substring(0, 160); // Limiter à 160 caractères pour la meta description
  }
</script>

<SEO 
	title={data?.project?.nom || 'Projet - Territoires Sensibles'}
	description={extractDescriptionText(data?.project?.description) || data?.project?.caracteristiques || ''}
	favicon={data?.site?.seo_favicon?.url || ''}
/>


<p class="project_menu_title">{data.project.nom}</p>
<button on:click={() => history.back()} class="button-outline retour">retour</button>

{#if data.project}
  <div class="project">

    <h1>{data.project.nom || 'Nom du projet'}</h1>
    {#if data.project.caracteristiques}
      <p class="characteristics">{data.project.caracteristiques}</p>
    {/if}
    {#if data.project.medias && data.project.medias.length > 0}
      <Slider media={data.project.medias} />
    {:else}
      <img src={ data.project.image.url?.startsWith('/') ? `http://localhost:1337${data.project.image.url}` : data.project.image.url} alt={data.project.image.legende} />
    {/if}
    


    {#if data.project.description}
      <div class="description">
        <p>{renderBlocks(data.project.description)}</p>
      </div>
    {/if}

    {#if data.project.credits}
    <div class="credits">
      <p>{renderBlocks(data.project.credits)}</p>
    </div>
  {/if}


    {#if data.project.lien}
    <div class="infos">
      <p class="infos_label">Plus d'infos</p>
      <a href={data.project.lien} class="button-outline" target="_blank">{data.project.lien_nom || 'Plus d\'infos'}</a>
    </div>
    {/if}
    <div class="tags">
      <p class="tags_label">Tags</p>
      <div class="tags_container">
        {#each data.project.tags as tag}
          <span class="tag">{tag.tag}</span>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="project-detail">
    <h1>Projet non trouvé</h1>
    <p>Le projet que vous recherchez n'existe pas ou a été supprimé.</p>
    <a href="/projets" class="oval-button">Retour aux projets</a>
  </div>
{/if}

<style lang="scss">
@use '../../../styles/_variables.scss' as *;
@use '../../../styles/_components.scss' as *;

.project_menu_title {
  position: fixed;
  top: 30px;
  right: 115px;
  font-size: $font-size-xl;
  transition: opacity 0.3s ease;
}

.project {
  display: flex;
  flex-direction: column;
  max-width: $page-width;
  margin: 0 0 0auto;
  padding: 120px 30px 180px 30px;
  white-space: pre-wrap;
  h1 {
    font-size: $font-size-xxl;
    margin-bottom: 15px;
  }
  .characteristics {
    font-size: $font-size-lg;
    margin-bottom: 30px;

  }
  .media-legend {
    margin: 16px 0 8px 0;
    font-size: $font-size-md;
  }
  .slider-counter {
    font-size: $font-size-md;

  }
  .description {
    margin: 32px 0;
    font-size: $font-size-lg;
    max-width: 1400px;
    
    h3 {
      margin-bottom: 16px;

    }
    
  }

  .credits {
    margin: 32px 0;
    white-space: pre-wrap;
    max-width: 1400px;


    p {
      font-size: $font-size-md;
      font-weight: 600;
    } 
    
  }

  .tags {
    margin-top: 24px;
    .tag {
      @extend .tag;
    }
  }
}

.button-outline {
  color: $color-primary;
  border: 1px solid $color-primary;
  padding: 5px 30px;
  border-radius: 100px;
  font-size: $font-size-lg;
  cursor: pointer;
  transition: all 0.3s ease;
}
.button-outline:hover {
  background-color: $color-primary;
  color: white;
}

.retour {
  position: absolute;
    right: 30px;
    top: 120px;
}

.infos {
  display: flex;
  align-items: center;
  gap: 15px;

}

.infos_label {
    font-size: $font-size-lg;
    width: 150px
  }

.tags {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.tags_label {
  margin-top: 12px;
  font-size: $font-size-lg;
  width: 150px;
}

.tags_container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 15px;
}

.tag {
  font-size: $font-size-lg;
  padding: 5px 30px;
  border-radius: 100px;
  background-color: $color-primary;
  color: white;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid $color-primary;
}

.tag:hover {
  background-color: white;
  color: $color-primary;

}

@media (max-width: 991px) {
  .project_menu_title {
    display: none;
  }

  .retour {
    right: 15px;
  }
  
  .project {
    padding: 180px 20px 120px 20px;
    
    h1 {
      font-size: $font-size-xl;
    }
    
    .characteristics {
      font-size: $font-size-md;
    }
    
    .description {
      font-size: $font-size-md;
    }
    
    .credits {
      p {
        font-size: $font-size-sm;
      }
    }
    
    .infos {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      
      .infos_label {
        width: auto;
        font-size: $font-size-md;
      }
    }
    
    .tags {
      flex-direction: column;
      gap: 15px;
      
      .tags_label {
        width: auto;
        font-size: $font-size-md;
      }
      
      .tags_container {
        flex-direction: row;
      }
    }
  }

  .retour {
    font-size: $font-size-sm;
  }
  

}

// Tablette (768px - 1024px)
@media (max-width: 991px) and (min-width: 768px) {
  .project {
    padding: 120px 15px 140px 15px;
    
    h1 {
      font-size: $font-size-xl;
    }
    
    .characteristics {
      font-size: $font-size-lg;
    }
    
    .description {
      font-size: $font-size-lg;
    }
  }
}

// Smartphone (jusqu'à 767px)
@media (max-width: 768px) {
  .project {
    padding: 120px 15px 120px 15px;
    
    h1 {
      font-size: $font-size-lg;
      margin-bottom: 10px;
    }
    
    .characteristics {
      font-size: $font-size-sm;
      margin-bottom: 20px;
    }
    
    .description {
      font-size: $font-size-sm;
      margin: 20px 0;
    }
    
    .credits {
      margin: 20px 0;
      
      p {
        font-size: 14px;
      }
    }
    
    .tags {
      margin-top: 20px;
      
      .tags_label {
        font-size: $font-size-sm;
      }
      
      .tag {
        font-size: $font-size-sm;
        padding: 4px 20px;
      }
    }
  }
  
  
  .button-outline {
    font-size: $font-size-sm;
  }
}



</style> 