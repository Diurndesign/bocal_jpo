// Bocal : l'interactivité commune
// Chargé (avec defer) par fridge.html, recipes.html et add.html.

// ---------- 1. Les produits ajoutés, gardés dans le navigateur ----------
// Les produits ajoutés avec l'écran « Ajouter un produit » sont enregistrés
// dans le localStorage du téléphone : ils restent après un rechargement,
// mais ne quittent jamais l'appareil.
const STORAGE_KEY = 'bocal-products';

const CATEGORY_LABELS = {
  vegetables: 'Légumes',
  dairy: 'Produits laitiers',
  fruits: 'Fruits',
  leftovers: 'Restes',
  grocery: 'Épicerie',
};

function loadProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return []; // navigation privée ou stockage bloqué : on fait sans
  }
}

function saveProduct(product) {
  const products = loadProducts();
  products.push(product);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return true;
  } catch (error) {
    return false;
  }
}

// Nombre de jours entre aujourd'hui et la date limite (format AAAA-MM-JJ)
function daysLeft(isoDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const limit = new Date(isoDate + 'T00:00:00');
  return Math.round((limit - today) / 86400000);
}

// ---------- 2. Afficher les produits ajoutés dans le frigo ----------
function createCard(product) {
  const days = daysLeft(product.date);
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.category = product.category;

  let infoText;
  if (days <= 0) {
    infoText = 'à finir aujourd\'hui';
  } else if (days === 1) {
    infoText = 'expire demain';
  } else {
    infoText = 'encore ' + days + ' jours';
  }
  if (days <= 1) {
    card.classList.add('urgent');
  } else if (days > 7) {
    card.classList.add('later');
  }

  const text = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = product.name; // textContent : le nom saisi n'est jamais lu comme du HTML
  const info = document.createElement('p');
  info.className = 'info';
  info.textContent = CATEGORY_LABELS[product.category] + ' · ' + infoText;
  text.append(title, info);

  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = 'J-' + Math.max(days, 0);

  card.append(text, badge);
  return { card, days };
}

function showAddedProducts() {
  const today = document.querySelector('#today');
  if (!today) {
    return; // on n'est pas sur la page du frigo
  }
  loadProducts().forEach((product) => {
    const { card, days } = createCard(product);
    let section = document.querySelector('#later');
    if (days <= 1) {
      section = today;
    } else if (days <= 7) {
      section = document.querySelector('#week');
    }
    section.append(card);
  });

  // Les compteurs suivent le contenu réel du frigo
  const cards = document.querySelectorAll('.card[data-category]');
  const urgent = document.querySelectorAll('#today .card[data-category]');
  document.querySelectorAll('[data-count="total"]').forEach((element) => {
    element.textContent = cards.length;
  });
  document.querySelectorAll('[data-count="today"]').forEach((element) => {
    element.textContent = urgent.length;
  });
}

showAddedProducts();

// ---------- 3. Les filtres du frigo ----------
const filterButtons = document.querySelectorAll('.filter');

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
    // Les cartes sont relues à chaque clic, pour inclure les produits ajoutés.
    document.querySelectorAll('.card[data-category]').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });

    // Une section qui n'a plus aucun produit visible disparaît aussi.
    document.querySelectorAll('main section').forEach((section) => {
      const cards = section.querySelectorAll('.card[data-category]');
      if (cards.length === 0) {
        return;
      }
      const hasVisibleCard = [...cards].some((card) => !card.hidden);
      section.hidden = !hasVisibleCard;
    });
  });
});

// ---------- 4. Le bouton « J'ai cuisiné ! » ----------
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
