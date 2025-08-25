<script>
  import { onMount } from 'svelte';
  
  export let title = '';
  export let description = '';
  export let favicon = '';
  
  onMount(() => {
    // Mettre à jour le titre de la page
    if (title) {
      document.title = title;
    }
    
    // Mettre à jour la meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description || '';
    
    // Mettre à jour le favicon
    console.log('🔧 Favicon data received:', favicon);
    console.log('🔧 Favicon type:', typeof favicon);
    if (favicon) {
      let faviconLink = document.querySelector('link[rel="icon"]');
      if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        document.head.appendChild(faviconLink);
      }
      
      // Construire l'URL complète du favicon
      let faviconUrl = '';
      
      // Si c'est un objet Strapi avec data.attributes.url
      if (typeof favicon === 'object' && favicon.data && favicon.data.attributes && favicon.data.attributes.url) {
        faviconUrl = favicon.data.attributes.url;
      }
      // Si c'est directement une URL
      else if (typeof favicon === 'string') {
        faviconUrl = favicon;
      }
      
      // Construire l'URL complète si nécessaire
      if (faviconUrl) {
        if (faviconUrl.startsWith('http')) {
          // URL absolue, utiliser telle quelle
        } else if (faviconUrl.startsWith('/')) {
          faviconUrl = `${import.meta.env.VITE_API_URL}${faviconUrl}`;
        } else {
          faviconUrl = `${import.meta.env.VITE_API_URL}/${faviconUrl}`;
        }
        
        faviconLink.href = faviconUrl;
        console.log('🔧 Favicon URL set to:', faviconUrl);
      }
    }
  });
</script>

<!-- Le composant ne rend rien visuellement -->
