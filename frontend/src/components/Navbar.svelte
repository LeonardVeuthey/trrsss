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
  }
  
  function closeMenu() {
    isMenuOpen = false;
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
      <div class="menu-overlay" on:click={closeMenu}></div>
      <div class="menu-dropdown">
        <div class="menu-dropdown_wrapper">
        <button class="menu-close" on:click={closeMenu} aria-label="Fermer">
          <span class="close-icon">×</span>
        </button>
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
  height: 63px;
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
    font-weight: 500;
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
  width: 300px;
  height: 500px;
  padding: 15px;
  z-index: 99;

}

.menu-dropdown_wrapper {
  background: white;
  border-left: 1px solid $color-primary;
  position: relative;

  padding: 30px 30px 60px;
  box-sizing: border-box;
  animation: slideIn 0.3s ease;
  border-radius: 30px;
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
  position: absolute;
  top: 30px;
  right: 30px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 55px;
  color: $color-primary;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-links {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  a {
    color: $color-primary;
    text-decoration: none;
    font-family: $font-main;
    font-size: $font-size-xl;
    font-weight: 500;
    transition: opacity 0.2s ease;
    line-height: 1;
    
    &:hover {
      opacity: 0.7;
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .navbar {
    padding: 20px;
  }
  
  .navbar-logo {
    width: 80px;
    height: 80px;
  }
  
  .page-title {
    font-size: $font-size-lg;
  }
  
  .menu-dropdown {
    width: 100%;
  }
}
</style> 