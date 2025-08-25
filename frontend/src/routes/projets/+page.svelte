<script>
  import TagFilter from '../../components/TagFilter.svelte';
  import ProjectCard from '../../components/ProjectCard.svelte';
  import SEO from '../../components/SEO.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { writable } from 'svelte/store';
  import { fetchStrapi } from '$lib/api.js';
  
  export let data;
  
  // Store pour gérer l'accumulation des projets
  const allProjects = writable([]);
  let isInitialLoad = true;
  let currentTagState = data.currentTag;
  
  // Réactivité : mettre à jour le store quand les données changent
  $: {
    console.log('🔄 Data changed, updating store');
    console.log('📄 Projets page - data received:', data);
    console.log('📄 Projets page - data.projects:', data.projects);
    console.log('📄 Projets page - data.projects length:', data.projects?.length);
    console.log('📄 Projets page - data.tags:', data.tags);
    console.log('📄 Projets page - pagination:', data.pagination);
    console.log('📄 Projets page - currentTag:', data.currentTag);
    
    // Vérifier si le tag a changé
    if (data.currentTag !== currentTagState) {
      console.log('🔄 Tag changed, resetting store');
      isInitialLoad = true;
      currentTagState = data.currentTag;
    }
    
    // Mettre à jour le store avec les nouveaux projets seulement au chargement initial
    if (data.projects && isInitialLoad) {
      console.log('🔄 Initial load, setting projects');
      allProjects.set(data.projects);
      isInitialLoad = false;
    }
  }
  
  // Debug détaillé pour le premier projet
  $: if (data.projects && data.projects.length > 0) {
    console.log('📄 Projets page - Premier projet:', data.projects[0]);
  }
  
  // Fonction pour naviguer vers un tag
  function navigateToTag(tagName) {
    console.log('🔄 Navigating to tag:', tagName);
    isInitialLoad = true; // Reset pour le nouveau tag
    currentTagState = tagName;
    const url = new URL($page.url);
    url.searchParams.set('tag', tagName);
    url.searchParams.delete('start'); // Reset pagination
    goto(url.toString());
  }
  
  // Fonction pour naviguer vers "Tous"
  function navigateToAll() {
    console.log('🔄 Navigating to all projects');
    isInitialLoad = true; // Reset pour "Tous"
    currentTagState = null;
    const url = new URL($page.url);
    url.searchParams.delete('tag');
    url.searchParams.delete('start');
    goto(url.toString());
  }
  
  // Fonction pour charger plus de projets
  async function loadMore() {
    console.log('🔄 Loading more projects...');
    const nextStart = data.pagination.start + data.pagination.limit;
    
    try {
      // Construction des paramètres de requête pour les projets
      let projectsParams = `?populate=*&pagination[limit]=${data.pagination.limit}&pagination[start]=${nextStart}&pagination[withCount]=true&sort[0]=nom:asc`;
      
      // Ajout du filtre pour exclure les projets cachés (projet_cache = true)
      // On inclut les projets avec projet_cache = false OU projet_cache = null/undefined
      projectsParams += `&filters[$or][0][projet_cache][$eq]=false&filters[$or][1][projet_cache][$null]=true`;
      
      // Ajout du filtre par tag si spécifié
      if (data.currentTag && data.currentTag !== '') {
        projectsParams += `&filters[tags][tag][$eq]=${data.currentTag}`;
      }
      
      console.log('🔗 Strapi API params:', projectsParams);
      
      // Utiliser fetchStrapi directement
      const newData = await fetchStrapi('/projets', projectsParams);
      console.log('📥 New data received:', newData);
      
      if (newData.data && newData.data.length > 0) {
        console.log('✅ Adding', newData.data.length, 'new projects');
        
        // Ajouter les nouveaux projets à la liste existante
        allProjects.update(currentProjects => {
          const updatedProjects = [...currentProjects, ...newData.data];
          console.log('📊 Total projects now:', updatedProjects.length);
          return updatedProjects;
        });
        
        // Mettre à jour la pagination
        data.pagination.start = nextStart;
        data.pagination.hasMore = nextStart + data.pagination.limit < (newData.meta?.pagination?.total || 0);
        
        console.log('✅ Load more completed successfully');
      } else {
        console.log('⚠️ No new projects found');
      }
    } catch (error) {
      console.error('❌ Error loading more projects:', error);
      if (error instanceof Error) {
        console.error('❌ Error details:', error.message);
      }
    }
  }
</script>

<SEO 
	title={data?.site?.seo_projets_metatitle || 'Projets - Territoires Sensibles'}
	description={data?.site?.seo_projets_metadescription || ''}
	favicon={data?.site?.seo_favicon?.url || ''}
/>

<div class="projects">
  <div class="projects_tags">
    {#if data.tags && data.tags.length > 0}
      {#each data.tags as tag, index}
        <button 
          class="projects_tags_button" 
          class:active={data.currentTag === tag.tag}
          on:click={() => navigateToTag(tag.tag)}
        >
          <p class="projects_tags_text">{tag.tag}</p>
        </button>
      {/each}
    {:else}
      <p>Aucun tag trouvé.</p>
    {/if}
  </div>

  <div class="tous" on:click={navigateToAll}>
    <div class="tous_button" class:active={!data.currentTag}>
      <div class="tous_button_icon">

      </div>
    </div>
    <p class="tous_text">Tous</p>
  </div>

  <div class="projects-list">
    {#if $allProjects && $allProjects.length > 0}
      {#each $allProjects as project, index}
        <div>
          <ProjectCard {project} />
        </div>
      {/each}
    {:else}
      <p>Aucun projet trouvé.</p>
    {/if}
  </div>
  
  {#if data.pagination.hasMore}
    <button class="oval-button load-more" on:click={loadMore}>
      Charger plus
    </button>
  {/if}
</div>

<style lang="scss">
@use '../../styles/_variables.scss' as *;
@use '../../styles/_components.scss' as *;
@use '../../styles/_global.scss' as *;

.projects {
  margin: 0 auto;
    padding: 180px 30px;
    display: flex;
    align-items: flex-start;
    justify-content: right;
    flex-direction: column;
  .projects-list {

    max-width: $page-width;
    display: flex;
    flex-wrap: wrap;
    gap: 60px 30px;

  }
  
  @media (max-width: 991px) {
    .projects-list {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 30px 15px;
    }
  }

  @media (max-width: 768px) {
    .projects-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 475px) {
    .projects-list {
      display: grid;
      grid-template-columns: 1fr;
    }
  }

  .load-more {
    display: block;
    margin: 0 auto;
    margin-top: 32px;
  }
}

.projects_tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.projects_tags_text {
    font-size: $font-size-lg;
  }
  .projects_tags_button {
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 100px;
    border: 1px solid $color-primary;
    color: $color-primary;
    background: transparent;
    transition: all 0.3s ease;
    
    &.active {
      background-color: $color-primary;
    }
    &.active .projects_tags_text {
      color: white !important;
    }
  }

.projects_tags_button:hover {
    background-color: $color-primary;
  }
  .projects_tags_button:hover .projects_tags_text {
    color: white;
  }

.tous {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: right;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;

  .tous_button {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100px;
    border: 1px solid $color-primary;
    padding: 3px;
    margin-top: 60px;
    margin-bottom: 60px;
    transition: all 0.3s ease;

    .tous_button_icon {
    width: 40px;
    height: 40px;
    background-color: $color-primary;
    border-radius: 100px;
    transition: all 0.3s ease;
  }
  
  &.active .tous_button_icon {
    background-color: $color-primary;
  }
  
  &:not(.active) .tous_button_icon {
    background-color: white;
  }
  }

  .tous_text {
    font-size: $font-size-lg;
    color: $color-primary;
    transition: all 0.3s ease;
  }
}

.tous:hover .tous_button_icon {
  background-color: white;
}

.tous.active .tous_text {
  font-weight: 600;
}



@media (max-width: 768px) {
  .projects_tags_text {
    font-size: $font-size-sm;
  }

}


</style> 