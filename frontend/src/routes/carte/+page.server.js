import { fetchStrapi } from '$lib/api';

export const load = async () => {
  console.log('🚀 Load function called for carte (server)');
  console.log('🔧 Environment check - VITE_API_URL:', import.meta.env.VITE_API_URL);
  
  try {
    const projetsRes = await fetchStrapi('/projets?populate=*');
    const siteRes = await fetchStrapi('/site?populate=*');
    
    console.log('📥 Load function - projetsRes:', projetsRes);
    
    const result = {
      projets: projetsRes.data || [],
      site: siteRes.data || {}
    };
    
    console.log('✅ Load function - returning:', result);
    return result;
  } catch (error) {
    console.error('❌ Error loading carte:', error);
    return {
      projets: [],
      site: {}
    };
  }
}; 