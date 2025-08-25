<script>
  export let project;
  
  // Fonction pour rendre les blocs de contenu Strapi
  function renderBlocks(blocks) {
    if (!blocks || !Array.isArray(blocks)) return '';
    
    return blocks.map(block => {
      if (block.type === 'paragraph' && block.children) {
        return block.children.map(child => child.text).join('');
      }
      return '';
    }).join(' ');
  }
</script>

<a href={`/projets/${project.slug}`} class="project-card">
  {#if project?.image?.url}
    <img 
      src={project.image.url?.startsWith('/') 
        ? `http://localhost:1337${project.image.url}` 
        : project.image.url} 
      alt={project?.nom} 
    />
  {/if}
  {#if project?.nom}
    <h2 class="projets_title">{project.nom}</h2>
  {/if}
  {#if project?.tags && project.tags.length > 0}
    <div class="project-tags">
      {#each project.tags as tag}
        <span class="project-tag">{tag.tag}</span>
      {/each}
    </div>
  {/if}
</a>

<style lang="scss">
@use '../styles/_variables.scss' as *;
@use '../styles/_components.scss' as *;

.projects-list {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.project-card {
  width: 300px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
}

.projets_title {
  font-size: $font-size-lg;
  font-weight: 400;
  margin-top: 10px;
  margin-bottom: 8px;
}

.project-tags {
  display: none;
}

.project-tag {
  font-size: 12px;
  padding: 4px 8px;
  background-color: rgba($color-primary, 0.1);
  color: $color-primary;
  border-radius: 12px;
  border: 1px solid rgba($color-primary, 0.2);
}

@media (max-width: 991px) {
  .project-card {
    width: 100%;
    img {
      height: 19vw;
    }
  }
}

@media (max-width: 768px) {
  .project-card {
    img {
      height: 30vw;
    }
  }
} 

@media (max-width: 478px) {
  .project-card {
    img {
      height: 53vw;
    }
  }
}
</style> 