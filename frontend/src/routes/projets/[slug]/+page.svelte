<script>
  import Slider from '../../../components/Slider.svelte';
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
</script>


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
  top: 38px;
  right: 115px;
  font-size: $font-size-xl;

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
    right: 32px;
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


</style> 