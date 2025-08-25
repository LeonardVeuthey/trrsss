<script>
  export let membre;
</script>

<div class="person_card">
  {#if membre}
    <div class="person_image">
      {#if membre.image}
        <img src={membre.image.url?.startsWith('/') ? `http://localhost:1337${membre.image.url}` : membre.image.url} alt={membre.nom} />
      {:else}
        <div class="image-placeholder">
          <span>👤</span>
        </div>
      {/if}
    </div>
    <div class="person_content">
      <h3 class="person_name">{membre.nom}</h3>
      {#if membre.description}
          <p class="person_description">{membre.description}</p>
      {/if}
      {#if membre.lien_projet}
          <a href={membre.lien_projet} class="button-outline">Voir les projets</a>
      {/if}
      <div class="projet_liens">
      {#if membre.url}
          <a href={membre.url} class="button-outline" target="_blank">Site personnel</a>
      {/if}
      {#if membre.instagram}
            <a href={membre.instagram} class="button-outline" target="_blank">Instagram</a>
        {/if}
      </div>
    </div>
  {:else}
    <p>Informations du membre non disponibles.</p>
  {/if}
</div>

<style lang="scss">
@use '../styles/_variables.scss' as *;
@use '../styles/_components.scss' as *;

.person_card {
  width: 100%;
} 

.person_image {
    width: 100%;
    height: 20vw;
    max-height: 295px;
    overflow: hidden;
}

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;
      color: #999;
    }
  

.person_name {
  font-size: $font-size-xl;
   margin: 15px 0 5px 0;
}

    .person_description {
      font-size: $font-size-lg;
      margin: 0;
    }

.projet_liens {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
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

@media (max-width: 991px) {
  .person_image {
    height: 30vw;
    max-height: none;
  }
}

@media (max-width: 768px) {
  .person_image {
    height: 60vw;
  }
  .person_name {
    font-size: $font-size-lg;
  }
  .person_description {
    font-size: $font-size-sm;
  }
  .button-outline {
    font-size: $font-size-sm;
  }
}
</style> 