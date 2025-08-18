<script>
  import { onMount } from 'svelte';
  import Swiper from 'swiper';
  import { Navigation, Pagination } from 'swiper/modules';
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';

  export let media;

  let swiperContainer;
  let swiper;

  onMount(() => {
    if (swiperContainer && media && media.length > 0) {
      swiper = new Swiper(swiperContainer, {
        modules: [Navigation, Pagination],
        slidesPerView: 1,
        spaceBetween: 30,
        navigation: {
          nextEl: '.next',
          prevEl: '.prev',
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
          formatFractionCurrent: function (number) {
            return number;
          },
          formatFractionTotal: function (number) {
            return number;
          },
        },
        loop: true,
      });
    }
  });

  // Fonction pour obtenir l'URL correcte du média
  function getMediaUrl(media) {
    if (!media || !media.medias || !media.medias.url) return '';
    const url = media.medias.url;
    return url.startsWith('/') ? `http://localhost:1337${url}` : url;
  }

  // Fonction pour obtenir l'URL de la vidéo YouTube
  /**
   * @param {any} media - L'objet média contenant l'URL vidéo
   * @returns {string} L'URL convertie pour l'intégration YouTube
   */
  function getYoutubeUrl(media) {
    if (!media || !media.url_video) return '';
    return convertYoutubeUrl(media.url_video);
  }

  // Fonction pour convertir une URL YouTube en URL d'intégration
  /**
   * @param {string} url - L'URL YouTube à convertir
   * @returns {string} L'URL d'intégration YouTube
   */
  function convertYoutubeUrl(url) {
    if (!url) return '';
    
    // Patterns pour différents formats d'URL YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    
    return url; // Retourne l'URL originale si aucun pattern ne correspond
  }

  // Fonction pour déterminer le type de média
  function getMediaType(media) {
    // Vérifier d'abord s'il y a une URL vidéo YouTube
    if (media && media.url_video) {
      return 'youtube';
    }
    
    if (!media || !media.medias || !media.medias.url) return 'image';
    
    const url = media.medias.url.toLowerCase();
    if (url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg')) {
      return 'video';
    } else if (url.includes('.mp3') || url.includes('.wav') || url.includes('.ogg')) {
      return 'audio';
    }
    return 'image';
  }
</script>

<div class="slider-container">
  {#if media && media.length > 0}
    <div class="swiper" bind:this={swiperContainer}>
      <div class="swiper-wrapper">
        {#each media as mediaItem, index}
          <div class="swiper-slide">
            <div class="media-content">
              <!-- Affichage du média selon son type -->
              {#if getMediaType(mediaItem) === 'youtube'}
                <iframe 
                  src={getYoutubeUrl(mediaItem)} 
                  title="Vidéo YouTube"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  class="media-element youtube-video"
                ></iframe>
              {:else if getMediaType(mediaItem) === 'video'}
                <video 
                  src={getMediaUrl(mediaItem)} 
                  controls
                  class="media-element"
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              {:else if getMediaType(mediaItem) === 'audio'}
                <div class="audio-container">
                  <audio 
                    src={getMediaUrl(mediaItem)} 
                    controls
                    class="media-element"
                  >
                    Votre navigateur ne supporte pas la lecture audio.
                  </audio>
                </div>
              {:else}
                <img 
                  src={getMediaUrl(mediaItem)} 
                  alt={mediaItem.legende || 'Image'}
                  class="media-element"
                />
              {/if}
              
              <!-- Légende -->
              {#if mediaItem.legende}
                <p class="legende">{mediaItem.legende}</p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
      
      <!-- Navigation -->
      <div class="next">→</div>
      
      <!-- Pagination -->
      <div class="swiper-pagination"></div>
    </div>
  {:else}
    <div class="no-media">
      <p>Aucun média disponible</p>
    </div>
  {/if}
</div>

<style lang="scss">
@use '../styles/_variables.scss' as *;

.slider-container {
  position: relative;
  max-width: 800px;
  margin-right: auto;
}

.swiper-wrapper {
  position: relative;
}

.swiper {
  width: 100%;
  height: 545px;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
}

.media-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  height: 100%;
}

.media-element {
  width: 100%;
  height: calc(100% - 60px);
  object-fit: contain;
}

.youtube-video {
  border: none;
}

.audio-container {
  width: 100%;
  height: 100%;
    display: flex;
    max-width: 400px;
    padding: 20px;
    /* background: #f5f5f5; */
    border-radius: 8px;
    align-content: center;
    justify-content: center;
    flex-direction: column;
  
  audio {
    width: 100%;
    height: 100px;
  }
}

.legende {
  font-size: $font-size-md;
  text-align: center;
  margin-top: auto;
  margin-right: auto;
}

// Navigation buttons
.next {
  color: $color-primary;

  font-size: 68px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: absolute;
  top: calc(50% - 10px);
  transform: translateY(-50%);
  z-index: 1000;
  right: 0px;
}




// Pagination
.swiper-pagination {
  position: absolute;
  bottom: 0px;
  right: 0px;
  font-size: $font-size-md;
  width: auto;
  display: flex;
  justify-content: flex-end;
  color: $color-primary;
}

.no-media {
  text-align: center;
  padding: 40px;
  font-size: $font-size-lg;
}

// Responsive
@media (max-width: 768px) {
  .swiper-button-next,
  .swiper-button-prev {
    width: 35px;
    height: 35px;
    
    &::after {
      font-size: 14px;
    }
  }
  
  .swiper-button-next {
    right: 10px;
  }
  
  .swiper-button-prev {
    left: 10px;
  }
  
  .swiper-pagination {
    bottom: 10px;
    right: 10px;
    font-size: $font-size-sm;
  }
}
</style> 