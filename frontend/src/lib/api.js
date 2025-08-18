// Utilitaire pour appeler l'API Strapi
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

export async function fetchStrapi(path, params = '') {
  const url = `${API_URL}/api${path}${params}`;
  
  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`Erreur API Strapi: ${res.status} - ${res.statusText}`);
    }
    
    const data = await res.json();
    
    // Traitement des URLs d'images
    if (data.data) {
      const processData = (item) => {
        // Traitement des images d'actualités
        if (item.actualite_image && Array.isArray(item.actualite_image)) {
          item.actualite_image = item.actualite_image.map((img) => ({
            ...img,
            url: img.url ? `${API_URL}${img.url}` : null,
            formats: img.formats ? Object.fromEntries(
              Object.entries(img.formats).map(([key, format]) => [
                key, 
                { ...format, url: format.url ? `${API_URL}${format.url}` : null }
              ])
            ) : null
          }));
        }
        
        // Traitement des médias de projets
        if (item.projet_medias && Array.isArray(item.projet_medias)) {
          item.projet_medias = item.projet_medias.map((media) => {
            if (media.image) {
              return {
                ...media,
                image: {
                  ...media.image,
                  url: media.image.url ? `${API_URL}${media.image.url}` : null
                }
              };
            }
            if (media.video) {
              return {
                ...media,
                video: {
                  ...media.video,
                  url: media.video.url ? `${API_URL}${media.video.url}` : null
                }
              };
            }
            return media;
          });
        }
        
        // Traitement des images de membres
        if (item.Membre_image && Array.isArray(item.Membre_image)) {
          item.Membre_image = item.Membre_image.map((img) => ({
            ...img,
            url: img.url ? `${API_URL}${img.url}` : null,
            formats: img.formats ? Object.fromEntries(
              Object.entries(img.formats).map(([key, format]) => [
                key, 
                { ...format, url: format.url ? `${API_URL}${format.url}` : null }
              ])
            ) : null
          }));
        }
        
        // Traitement des vidéos de la page d'accueil
        if (item.Video && Array.isArray(item.Video)) {
          item.Video = item.Video.map((video) => ({
            ...video,
            url: video.url ? `${API_URL}${video.url}` : null
          }));
        }
        
        return item;
      };
      
      if (Array.isArray(data.data)) {
        data.data = data.data.map(processData);
      } else {
        data.data = processData(data.data);
      }
    }
    
    return data;
  } catch (error) {
    throw error;
  }
} 