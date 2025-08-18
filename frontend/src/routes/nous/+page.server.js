import { fetchStrapi } from '$lib/api.js';

export const load = async () => {
  console.log('🚀 Load function called for nous (server)');
  console.log('🔧 Environment check - VITE_API_URL:', import.meta.env.VITE_API_URL);
  
  try {
    const membresRes = await fetchStrapi('/membres?populate=*');
    const nousRes = await fetchStrapi('/nous');
    
    console.log('📥 Load function - membresRes:', membresRes);
    console.log('📥 Load function - membresRes.data:', membresRes.data);
    console.log('📥 Load function - nousRes:', nousRes);
    console.log('📥 Load function - nousRes.data:', nousRes.data);
    
    const result = {
      membres: membresRes.data || [],
      nous: nousRes.data || {}
    };
    
    console.log('✅ Load function - returning:', result);
    return result;
  } catch (error) {
    console.error('❌ Error loading nous:', error);
    return {
      membres: [],
      nous: {}
    };
  }
}; 