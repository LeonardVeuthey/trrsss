import { fetchStrapi } from '$lib/api';

export const load = async ({ params }) => {
  console.log('🚀 Load function called for projet detail (server)');
  console.log('🔧 Environment check - VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('🔧 Params:', params);
  console.log('🔧 Slug recherché:', params.slug);
  
  // Log immédiat pour vérifier que la fonction est appelée
  console.log('🔍 Début de la recherche du projet...');
  
  try {
    console.log('🔍 Tentative de récupération de tous les projets...');
    
    // D'abord, récupérer tous les projets pour voir la structure
    const allProjectsRes = await fetchStrapi('/projets?populate[medias][populate]=*&populate[tags][populate]=*');
    console.log('📥 Tous les projets:', allProjectsRes.data);
    console.log('📥 Nombre de projets:', allProjectsRes.data?.length || 0);
    
    if (!allProjectsRes.data || allProjectsRes.data.length === 0) {
      console.log('❌ Aucun projet trouvé dans l\'API');
      return { project: null };
    }
    
    // Afficher le premier projet pour voir la structure
    console.log('📥 Premier projet structure:', allProjectsRes.data[0]);
    
    // Chercher le projet par slug (priorité)
    const projectBySlug = allProjectsRes.data.find(p => p.slug === params.slug);
    console.log('📥 Projet trouvé par slug:', projectBySlug);
    
    if (projectBySlug) {
      const result = { project: projectBySlug };
      console.log('✅ Load function - returning by slug:', result);
      return result;
    }
    
    // Fallback par documentId
    console.log('🔍 Slug non trouvé, recherche par documentId...');
    const project = allProjectsRes.data.find(p => p.documentId === params.slug);
    console.log('📥 Projet trouvé par documentId:', project);
    
    if (project) {
      const result = { project: project };
      console.log('✅ Load function - returning by documentId:', result);
      return result;
    }
    
    // Fallback par ID
    console.log('🔍 DocumentId non trouvé, recherche par ID...');
    const projectById = allProjectsRes.data.find(p => p.id.toString() === params.slug);
    console.log('📥 Projet trouvé par ID:', projectById);
    
    if (projectById) {
      const result = { project: projectById };
      console.log('✅ Load function - returning by ID:', result);
      return result;
    }
    
    // Si aucun projet trouvé
    console.log('❌ Aucun projet trouvé avec slug, documentId ou ID:', params.slug);
    console.log('🔍 DocumentIds disponibles:', allProjectsRes.data.map(p => p.documentId));
    console.log('🔍 Slugs disponibles:', allProjectsRes.data.map(p => p.slug));
    console.log('🔍 IDs disponibles:', allProjectsRes.data.map(p => p.id));
    return { project: null };
    
  } catch (error) {
    console.error('❌ Error loading projet detail:', error);
    return {
      project: null
    };
  }
}; 