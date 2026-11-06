// Bocal : un peu d'interactivité
// Ce fichier est chargé par fridge.html et recipes.html (attribut defer :
// il s'exécute une fois la page lue, donc les éléments existent déjà).

// ---------- 1. Les filtres du frigo ----------
const filterButtons = document.querySelectorAll('.filter');
const productCards = document.querySelectorAll('.card[data-category]');
const fridgeSections = document.querySelectorAll('main section');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    // Le bouton cliqué devient actif, les autres non.
    // aria-pressed annonce l'état du bouton aux lecteurs d'écran.
    filterButtons.forEach((otherButton) => {
      const isActive = otherButton === button;
      otherButton.classList.toggle('active', isActive);
      otherButton.setAttribute('aria-pressed', isActive);
    });

    // On garde visibles seulement les produits de la catégorie choisie.
    productCards.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });

    // Une section qui n'a plus aucun produit visible disparaît aussi.
    fridgeSections.forEach((section) => {
      const cards = section.querySelectorAll('.card[data-category]');
      if (cards.length === 0) {
        return;
      }
      const hasVisibleCard = [...cards].some((card) => !card.hidden);
      section.hidden = !hasVisibleCard;
    });
  });
});

// ---------- 2. Le bouton « J'ai cuisiné ! » ----------
const cookedButton = document.querySelector('#cooked-button');
const cookedMessage = document.querySelector('#cooked-message');

if (cookedButton) {
  cookedButton.addEventListener('click', () => {
    cookedButton.textContent = 'Bravo !';
    cookedButton.disabled = true;
    // Le message est dans un role="status" : il est lu par les lecteurs d'écran.
    cookedMessage.textContent = '3 produits sauvés : ils ont quitté ton frigo.';
  });
}
