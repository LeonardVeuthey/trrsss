<script>
  import PersonCard from '../../components/PersonCard.svelte';
  import SEO from '../../components/SEO.svelte';
  
  export let data;
  
  console.log('📄 Nous page - data received:', data);
  console.log('📄 Nous page - data.membres:', data.membres);
  console.log('📄 Nous page - data.membres length:', data.membres?.length);
  console.log('📄 Nous page - data.nous:', data.nous);
  
  // Debug détaillé pour le premier membre
  if (data.membres && data.membres.length > 0) {
    console.log('📄 Nous page - Premier membre:', data.membres[0]);
    console.log('📄 Nous page - Premier membre attributes:', data.membres[0].attributes);
  }
</script>

<SEO 
	title={data?.site?.seo_nous_metatitle || 'Nous - Territoires Sensibles'}
	description={data?.site?.seo_nous_metadescription || ''}
	favicon={data?.site?.seo_favicon?.url || ''}
/>

<div class="nous">
  <div class="team-description">
    {#if data.nous?.description}
      <p class="nous_description">{data.nous.description}</p>
    {/if}
  </div>
  <div class="nous_list">
    {#if data.membres && data.membres.length > 0}

      {#each data.membres as membre, index}
        <div>
          <PersonCard {membre} />
        </div>
      {/each}
    {:else}
      <p> Aucun membre trouvé.</p>
      <details>
        <summary>🔍 Debug - Voir les données reçues</summary>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </details>
    {/if}
  </div>
  <div class="contact-block">
    <h2>Nous contacter</h2>
    <a class="button" href="mailto:{data.nous?.email}">{data.nous?.email}</a>
    <address>
      {data.nous?.adresse}
    </address>
  </div>
</div>

<style lang="scss">
@use '../../styles/_variables.scss' as *;
@use '../../styles/_components.scss' as *;



.nous {
  padding: 180px 30px;
  margin-right: auto;
  max-width: $page-width;
  .nous_description {
    font-size: $font-size-xl;
    margin-bottom: 60px;
  }
  .nous_list {
    width: 100%;
    max-width: 1400px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin-bottom: 60px;
  }
  .contact-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 60px;
    h2 {
      font-size: $font-size-xl;
      margin-bottom: 15px;
    }

    address {
      font-style: normal;
      font-size: $font-size-lg;
      margin-top: 30px;
      white-space: pre-line;
    }
  }
}

.button {
  color: white;
  border: 1px solid $color-primary;
  background-color: $color-primary;
  padding: 5px 30px;
  border-radius: 100px;
  font-size: $font-size-lg;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  
  &:hover {
    background-color: white;
    color: $color-primary;
  }
}

@media (max-width: 991px) {
  .nous {
    padding: 120px 15px;
    
    .nous_list {
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
  }
}

@media (max-width: 768px) {
  .nous {
    padding: 120px 15px;

    .nous_description {
      font-size: 28px;
    }

    .nous_list {
      grid-template-columns: repeat(1, 1fr);
      gap: 90px;
    }

    .contact-block {
      h2 {
        font-size: $font-size-lg;
      }
      address { 
        font-size: $font-size-sm;
      }
    }
    .button {
      font-size: $font-size-sm;
    }
  }



}


</style> 