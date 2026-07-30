/**
 * Lenis singleton — created in main.jsx, exported here for access across the app.
 * Used to programmatically scroll (e.g., scroll-to-top on route change).
 */
let lenisInstance = null;

export function setLenis(instance) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
}

export function scrollToTop(immediate = false) {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate });
  } else {
    window.scrollTo(0, 0);
  }
}
