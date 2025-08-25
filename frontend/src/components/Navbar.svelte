<script>
  import { page } from '$app/stores';
  
  let isMenuOpen = false;
  let currentPageName = '';
  
  // Déterminer si on est sur la page d'accueil
  $: isHomePage = $page.url.pathname === '/';
  
  // Déterminer le nom de la page actuelle
  $: currentPageName = getPageName($page.url.pathname);

  $: console.log('🔍 Page actuelle:', $page.url.pathname);
  
  function getPageName(pathname) {
    switch (pathname) {
      case '/carte':
        return 'Carte';
      case '/projets':
        return 'Projets';
      case '/nous':
        return 'Nous';
      case '/actualites':
        return 'Actualités';
      default:
        return '';
    }
  }
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    
    // Cacher/montrer navbar-content
    const navbarContent = document.querySelector('.navbar-content');
    if (navbarContent) {
      if (isMenuOpen) {
        navbarContent.style.opacity = '0';
        navbarContent.style.pointerEvents = 'none';
      } else {
        navbarContent.style.opacity = '1';
        navbarContent.style.pointerEvents = 'auto';
      }
    }
    
    // Cacher/montrer project_menu_title
    const projectMenuTitle = document.querySelector('.project_menu_title');
    if (projectMenuTitle) {
      if (isMenuOpen) {
        projectMenuTitle.style.opacity = '0';
        projectMenuTitle.style.pointerEvents = 'none';
      } else {
        projectMenuTitle.style.opacity = '1';
        projectMenuTitle.style.pointerEvents = 'auto';
      }
    }
  }
  
  function closeMenu() {
    isMenuOpen = false;
    
    // Remontrer navbar-content
    const navbarContent = document.querySelector('.navbar-content');
    if (navbarContent) {
      navbarContent.style.opacity = '1';
      navbarContent.style.pointerEvents = 'auto';
    }
    
    // Remontrer project_menu_title
    const projectMenuTitle = document.querySelector('.project_menu_title');
    if (projectMenuTitle) {
      projectMenuTitle.style.opacity = '1';
      projectMenuTitle.style.pointerEvents = 'auto';
    }
  }
</script>

<nav class="navbar">
  <a class="navbar-logo" href="/">
    <img src="/logo.png" alt="Territoires Sensibles" />
  </a>

  {#if isHomePage}
    <!-- Menu horizontal pour la page d'accueil -->
    <div class="navbar-menu">
      <a href="/carte">Carte</a>
      <a href="/projets">Projets</a>
      <a href="/nous">Nous</a>
      <a href="/actualites">Actualités</a>
    </div>
  {:else}
    <!-- Menu hamburger pour les autres pages -->
    <div class="navbar-content">
      <span class="page-title">{currentPageName}</span>
      <button class="hamburger" on:click={toggleMenu} aria-label="Menu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>
    
    <!-- Menu déroulant -->
    {#if isMenuOpen}
      <div class="menu-dropdown">
        <div class="menu-dropdown_wrapper">
        <div class="menu-close" on:click={closeMenu} aria-label="Fermer le menu">
          ×
        </div>
        <div class="menu-links">
          <a href="/carte" on:click={closeMenu}>Carte</a>
          <a href="/projets" on:click={closeMenu}>Projets</a>
          <a href="/nous" on:click={closeMenu}>Nous</a>
          <a href="/actualites" on:click={closeMenu}>Actualités</a>
        </div>
      </div>
      </div>
    {/if}
  {/if}
</nav>

<style lang="scss">
@use '../styles/_variables.scss' as *;
@use '../styles/_global.scss' as *;
@use '../styles/_layout.scss' as *;
@use '../styles/_components.scss' as *;
@use '../styles/_normalize.scss' as *;

.navbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  font-size: $font-size-xl;
  color: $color-primary;
  box-sizing: border-box; 
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background: transparent;
}

.navbar-logo {
  height: 50px;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.navbar-menu {
  display: flex;
  gap: 30px;
  margin-left: auto;
  
  a {
    color: $color-primary;
    text-decoration: none;
    font-family: $font-main;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 0.7;
    }
  }
}

.navbar-content {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
  transition: opacity 0.3s ease;
}

.page-title {
  color: $color-primary;
  font-family: $font-main;
  font-size: $font-size-xl;
  font-weight: 400;
}

.hamburger {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
}

.hamburger-line {
  width: 50px;
  height: 5px;
  background-color: $color-primary;
  transition: all 0.3s ease;
  border-radius: 10px;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 98;
}

.menu-dropdown {
  position: fixed;
  top: 0;
  right: 0;
  padding: 30px;
  z-index: 99;

}


@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.menu-close {
  display: none !important;
  cursor: pointer;
  font-size: 55px;
  color: $color-primary;
  padding: 0;
}

.menu-links {
  display: flex;
  flex-direction: row;
  align-items: end;
  justify-content: end;
  gap: 15px;
  
  a {
    color: $color-primary;
    text-decoration: none;
    font-family: $font-main;
    font-size: $font-size-xl;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 0.7;
    }
  }
}

// Responsive design
@media (max-width: 991px) {

  .navbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .navbar-menu {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    gap: 0px;
  }

  .menu-close {
    display: flex !important;
    height: 37px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
  }

  .menu-links {
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    gap: 0;
    line-height: 1.2;
  }

  .navbar {
    padding: 15px;
  }
  
  .navbar-logo {
    height: 40px;
  }
  
  .page-title {
    font-size: $font-size-lg;
  }

  .menu-dropdown {
    padding: 15px;
  }
  
  .menu-dropdown_wrapper {
    background-color: white;
    border-radius: 30px;
    border: 1px solid $color-primary;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    width: 100%;
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .navbar-menu {
    font-size: $font-size-lg;
  }
}

@media (max-width: 479px) {
  .page-title {
    display: none;
  }
}
</style> 