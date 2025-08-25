import { fetchStrapi } from '$lib/api.js';

export const load = async () => {
  try {
    const siteRes = await fetchStrapi('/site?populate=*');
    
    const result = {
      site: siteRes.data || {}
    };
    
    return result;
  } catch (error) {
    return {
      site: {}
    };
  }
}; 