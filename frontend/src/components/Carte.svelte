<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { fetchStrapi } from '$lib/api';

  let mapContainer;
  let map;
  let markers = [];

  onMount(async () => {
    // Vérifier que nous sommes côté client
    if (!browser) return;

    // Import dynamique de Leaflet côté client uniquement
    const L = await import('leaflet');
    await import('leaflet/dist/leaflet.css');

    // Initialiser la carte

  // Définition des limites globales
  const worldBounds = L.latLngBounds(
    L.latLng(-90, -180),  // coin Sud-Ouest
    L.latLng( 90,  180)   // coin Nord-Est
  );


    const map = L.map(mapContainer, {
  center: [46.52033692800149, 6.630987170129743],
  zoom: 9.3,
  zoomControl: false,
  maxZoom: 16,
  minZoom: 3,
  maxBounds: worldBounds, 
  maxBoundsViscosity: 1.0 

  
});


    // Ajouter les tuiles OpenStreetMap
    /*L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);*/

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	  
    }).addTo(map);


      // Ajout des boutons de zoom en bas à gauche
  L.control.zoom({
    position: 'bottomleft'
  }).addTo(map);

    try {
      // Récupérer les projets depuis l'API Strapi
      const response = await fetchStrapi('/projets?populate=*');
      const projets = response.data || [];

      console.log('📍 Projets récupérés:', projets.length, 'projets');

      // Créer les marqueurs pour chaque projet
      projets.forEach((projet) => {
        try {
          console.log('📍 Projet brut:', projet);
          
          // Vérifier la structure des données
          const attributes = projet || projet;
          console.log('📍 Attributes:', attributes);
          
          const titre = attributes.titre || attributes.nom || 'Projet sans titre';
          // Les coordonnées semblent être inversées dans Strapi
          const latitude = attributes.latitude; // Utiliser longitude comme latitude
          const longitude = attributes.longitude; // Utiliser latitude comme longitude
          const slug = attributes.slug;
          const image = attributes.image?.data?.attributes?.url || attributes.image?.url;
          const fullImageUrl = image ? `http://localhost:1337${image}` : null;
          
          console.log('📍 Données projet:', { titre, slug, image: fullImageUrl, attributes });
          console.log('📍 Image URL complète:', fullImageUrl);
          console.log('📍 Slug:', slug);
          console.log('📍 Image brute:', attributes.image);
        
        // Vérifier que les coordonnées existent
        if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
          console.log('📍 Marqueur créé:', titre, 'à', latitude.toFixed(4), longitude.toFixed(4));
          
          const marker = L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: 'custom-marker',
              html: '<div class="marker-circle"></div>',
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            })
          })
          .addTo(map)
          .bindPopup(`
            <div class="popup-content">
              <h3 class="popup_title">${titre}</h3>
              ${fullImageUrl ? `<img class="popup_image" src="${fullImageUrl}" alt="${titre}"  />` : ''}
              ${slug ? `<a href="/projets/${slug}" class="popup_link">Voir le projet</a>` : ''}
            </div>
          `);

          markers.push(marker);
        } else {
          console.log('⚠️ Coordonnées manquantes ou invalides pour:', titre, 'lat:', latitude, 'lng:', longitude);
        }
        } catch (error) {
          console.error('❌ Erreur lors du traitement du projet:', error);
          console.error('❌ Projet problématique:', projet);
        }
      });

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des projets:', error);
    }
  });

  // Nettoyer les marqueurs lors de la destruction du composant
  onMount(() => {
    return () => {
      if (browser && map) {
        map.remove();
      }
      if (browser) {
        markers.forEach(marker => marker.remove());
      }
    };
  });
</script>

<div bind:this={mapContainer} id="map"></div>

<style lang="scss">
  #map {
    height: 100vh;
    width: 100%;
    z-index: 1;
  }

  /* Styles pour les popups Leaflet */
  :global(.leaflet-popup-content-wrapper) {
    width: 240px !important;
    background: #0400F5 !important;
    color: white !important;
    border-radius: 15px !important;
  }

  :global(.leaflet-popup-close-button) {
    opacity: 0 !important;
  }

  :global(.leaflet-popup-tip) {
    background: #0400F5 !important;
  }

  :global(.leaflet-popup-content) {
    margin: 15px 5px   !important;
    color: white !important;
  }

  :global(.leaflet-popup-close-button) {
    color: white !important;
    font-size: 28px !important;
  }

  :global(.popup_title) {
    font-size: 24px;
    font-weight: 500;
    color: white !important;
    margin-bottom: 10px;
  }

  :global(.popup_image) {
      width: 300px !important;
      height: 140px!important;
      object-fit: cover;
      margin-bottom: 8px;
    }

    


    :global(.popup_link) {
      text-decoration: none;
      color: white !important;
      font-size: 14px;
      font-weight: 500;
    }



  :global(.custom-marker) {
    background: transparent;
    border: none;
  }

  :global(.marker-circle) {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #0400F5;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -15px 0 0 -15px;
    box-shadow: 0 2px 8px rgba(4, 0, 245, 0.4);
    transition: background 0.3s ease;
  }

  :global(.marker-circle:hover) {
    background: #8482ff !important ;
  }

  :global(.leaflet-control-attribution) {
    display: none;
  }
</style> 