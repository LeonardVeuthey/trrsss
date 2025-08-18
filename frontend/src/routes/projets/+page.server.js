import { fetchStrapi } from '$lib/api.js';

export const load = async ({ url }) => {
  console.log('🚀 Load function called for projets (server)');
  
  // Récupération des paramètres URL
  const tag = url.searchParams.get('tag');
  const start = parseInt(url.searchParams.get('start') || '0');
  const limit = 5;
  
  console.log('📋 URL params - tag:', tag, 'start:', start, 'limit:', limit);
  
  try {
    // Récupération de tous les tags d'abord
    const allTagsRes = await fetchStrapi('/tags');
    
    // Récupération de tous les projets pour identifier les tags utilisés
    const allProjectsRes = await fetchStrapi('/projets?populate=*');
    
    console.log('📥 Load function - allTagsRes:', allTagsRes);
    console.log('📥 Load function - allProjectsRes:', allProjectsRes);
    
    // Debug: voir la structure d'un projet
    if (allProjectsRes.data && allProjectsRes.data.length > 0) {
      console.log('🔍 Premier projet structure:', JSON.stringify(allProjectsRes.data[0], null, 2));
    }
    
    // Créer un Set des tags utilisés dans les projets
    const usedTags = new Set();
    if (allProjectsRes.data) {
      allProjectsRes.data.forEach(project => {
        if (project.tags && Array.isArray(project.tags)) {
          project.tags.forEach(tag => {
            if (tag.tag) {
              usedTags.add(tag.tag);
            }
          });
        }
      });
    }
    
    // Filtrer les tags qui sont utilisés dans au moins un projet
    const availableTags = allTagsRes.data?.filter(tag => 
      usedTags.has(tag.tag)
    ) || [];
    
    console.log('📊 Used tags:', Array.from(usedTags));
    console.log('📊 Available tags with projects:', availableTags.length);
    console.log('📊 Available tags:', availableTags.map(t => t.tag));
    
    // Construction des paramètres de requête pour les projets
    let projectsParams = `?populate=*&pagination[limit]=${limit}&pagination[start]=${start}&pagination[withCount]=true&sort[0]=nom:asc`;
    
    // Ajout du filtre par tag si spécifié (seulement si un tag est sélectionné)
    if (tag && tag !== '') {
      // Essayer d'abord avec le nom du tag
      projectsParams += `&filters[tags][tag][$eq]=${tag}`;
      console.log('🔍 Filtering by tag name:', tag);
      console.log('🔍 Projects params with filter:', projectsParams);
    }
    
    // Récupération des projets
    const projectsRes = await fetchStrapi('/projets', projectsParams);
    
    console.log('📥 Load function - projectsRes:', projectsRes);
    console.log('📥 Load function - projects count:', projectsRes.data?.length || 0);
    
    // Si aucun projet trouvé avec le filtre par nom, essayer avec l'ID
    if (tag && tag !== '' && (!projectsRes.data || projectsRes.data.length === 0)) {
      console.log('⚠️ No projects found with tag name, trying with ID...');
      
      // Trouver l'ID du tag sélectionné
      const selectedTag = availableTags.find(t => t.tag === tag);
      if (selectedTag) {
        let projectsParamsWithId = `?populate=*&pagination[limit]=${limit}&pagination[start]=${start}&pagination[withCount]=true&sort[0]=nom:asc&filters[tags][id][$eq]=${selectedTag.id}`;
        console.log('🔍 Trying with tag ID:', selectedTag.id);
        console.log('🔍 Projects params with ID filter:', projectsParamsWithId);
        
        const projectsResWithId = await fetchStrapi('/projets', projectsParamsWithId);
        console.log('📥 Load function - projectsResWithId:', projectsResWithId);
        
        if (projectsResWithId.data && projectsResWithId.data.length > 0) {
          // Utiliser les résultats avec l'ID
          projectsRes.data = projectsResWithId.data;
          projectsRes.meta = projectsResWithId.meta;
        }
      }
    }
    
    // Calcul de la pagination
    const totalCount = projectsRes.meta?.pagination?.total || 0;
    const hasMore = start + limit < totalCount;
    
    console.log('📊 Pagination info:', {
      totalCount,
      hasMore,
      start,
      limit
    });
    
    const result = {
      projects: projectsRes.data || [],
      tags: availableTags,
      pagination: {
        totalCount,
        hasMore,
        start,
        limit
      },
      currentTag: tag
    };
    
    console.log('✅ Load function - returning:', result);
    return result;
  } catch (error) {
    console.error('❌ Error loading projets:', error);
    return {
      projects: [],
      tags: [],
      pagination: {
        totalCount: 0,
        hasMore: false,
        start: 0,
        limit: 25
      },
      currentTag: tag
    };
  }
}; 