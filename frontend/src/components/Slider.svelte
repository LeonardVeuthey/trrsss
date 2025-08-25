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
        // Options pour mobile
        touchRatio: 1,
        touchAngle: 45,
        grabCursor: true,
        // Responsive breakpoints
        breakpoints: {
          // Mobile (jusqu'à 768px)
          320: {
            spaceBetween: 15,
            touchRatio: 1.5,
          },
          // Tablette (768px - 1024px)
          768: {
            spaceBetween: 20,
            touchRatio: 1.2,
          },
          // Desktop (1024px+)
          1024: {
            spaceBetween: 30,
            touchRatio: 1,
          }
        }
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
      <div class="prev">←</div>
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

.prev {
  color: $color-primary;
  font-size: 68px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: absolute;
  top: calc(50% - 10px);
  transform: translateY(-50%);
  z-index: 1000;
  left: 0px;
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

// Responsive styles
// Tablette (768px - 1024px)
@media (max-width: 991px) and (min-width: 769px) {
  .slider-container {
    max-width: 100%;
    margin: 0 auto;
  }
  
  .swiper {
    height: calc(56.25vw + 50px); // 16/9 ratio (9/16 * 100)
  }
  
  .next {
    font-size: 48px;
    right: 10px;
  }

  .prev {
    font-size: 48px;
    left: 10px;
  }
  
  .swiper-pagination {
    bottom: 10px;
    right: 10px;
    font-size: $font-size-sm;
  }
  
  .legende {
    font-size: $font-size-sm;
  }
  
  .audio-container {
    max-width: 300px;
    padding: 15px;
    
    audio {
      height: 80px;
    }
  }
}

// Smartphone (jusqu'à 768px)
@media (max-width: 768px) {
  .slider-container {
    max-width: 100%;
    margin: 0 auto;
  }
  
  .swiper {
    height: calc(56.25vw + 50px); // 16/9 ratio (9/16 * 100)
  }
  
  .media-content {
    gap: 12px;
  }
  
  .media-element {
    height: calc(100% - 50px);
  }
  
  .next {
    font-size: 36px;
    right: 5px;
    top: calc(50% - 8px);
  }

  .prev {
    font-size: 36px;
    left: 5px;
    top: calc(50% - 8px);
  }
  
  .swiper-pagination {
    bottom: 5px;
    right: 5px;
    font-size: 16px;
  }
  
  .legende {
    font-size: 16px;
    margin-top: 8px;
  }
  
  .audio-container {
    max-width: 250px;
    padding: 10px;
    
    audio {
      height: 60px;
    }
  }
  
  .no-media {
    padding: 20px;
    font-size: $font-size-md;
  }
}

// Très petits écrans (jusqu'à 480px)
@media (max-width: 480px) {
  .swiper {
    height: calc(56.25vw + 50px); // 16/9 ratio (9/16 * 100)
  }
  
  .next {
    font-size: 28px;
    right: 2px;
  }

  .prev {
    font-size: 28px;
    left: 2px;
  }
  
  .swiper-pagination {
    font-size: 14px;
  }
  
  .legende {
    font-size: 14px;
  }
  
  .audio-container {
    max-width: 200px;
    padding: 8px;
    
    audio {
      height: 50px;
    }
  }
}

// Orientation paysage sur mobile
@media (max-width: 768px) and (orientation: landscape) {
  .swiper {
    height: 56.25vw; // 16/9 ratio (9/16 * 100)
    max-height: 250px; // Limite pour éviter que ce soit trop grand
  }
  
  .media-content {
    gap: 8px;
  }
  
  .legende {
    font-size: 14px;
    margin-top: 4px;
  }
}
</style> 