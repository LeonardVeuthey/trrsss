import { fetchStrapi } from '$lib/api.js';

export const load = async () => {
  console.log('🚀 Load function called for home (server)');
  console.log('🔧 Environment check - VITE_API_URL:', import.meta.env.VITE_API_URL);
  
  try {
    const accueilRes = await fetchStrapi('/accueil?populate=*');
    const siteRes = await fetchStrapi('/site?populate=*');
    console.log('📥 Load function - accueilRes:', accueilRes);
    console.log('📥 Load function - accueilRes.data:', accueilRes.data);
    console.log('📥 Load function - accueilRes.data?.attributes:', accueilRes.data?.attributes);
    
    const result = {
      accueil: accueilRes.data || {},
      site: siteRes.data || {}
    };
    
    console.log('✅ Load function - returning:', result);
    return result;
  } catch (error) {
    console.error('❌ Error loading accueil:', error);
    return {
      accueil: {},
      site: {}
    };
  }
}; 