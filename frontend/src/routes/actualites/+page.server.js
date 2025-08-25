import { fetchStrapi } from '$lib/api.js';

export const load = async () => {
  console.log('🚀 Load function called for actualites (server)');
  console.log('🔧 Environment check - VITE_API_URL:', import.meta.env.VITE_API_URL);
  
  try {
    const actualiteesRes = await fetchStrapi('/actualitees?populate=*');
    const siteRes = await fetchStrapi('/site?populate=*');
    console.log('📥 Load function - actualiteesRes:', actualiteesRes);
    console.log('📊 Load function - actualiteesRes.data:', actualiteesRes.data);
    
    const result = {
      actualitees: actualiteesRes.data || [],
      site: siteRes.data || {}
    };
    
    console.log('✅ Load function - returning:', result);
    return result;
  } catch (error) {
    console.error('❌ Error loading actualites:', error);
    return {
      actualitees: [],
      site: {}
    };
  }
}; 