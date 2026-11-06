// Bocal : l'écran « Ajouter un produit »
// Chargé après script.js (qui fournit saveProduct).
// La bibliothèque de lecture des codes-barres (vendor/html5-qrcode.min.js)
// n'est chargée qu'au premier scan : la page s'affiche plus vite.

const form = document.querySelector('#add-form');
const nameInput = document.querySelector('#product-name');
const categorySelect = document.querySelector('#product-category');
const dateInput = document.querySelector('#product-date');
const statusMessage = document.querySelector('#scan-status');
const reader = document.querySelector('#reader');
const cameraButton = document.querySelector('#camera-button');
const stopButton = document.querySelector('#stop-button');
const photoInput = document.querySelector('#photo-input');

// ---------- 1. Une date limite proposée selon la catégorie ----------
// Un ordre de grandeur, que l'utilisateur corrige au besoin.
const DEFAULT_DAYS = { vegetables: 5, dairy: 7, fruits: 7, leftovers: 2, grocery: 30 };
let dateChangedByUser = false;

function suggestDate() {
  if (dateChangedByUser) {
    return;
  }
  const date = new Date();
  date.setDate(date.getDate() + DEFAULT_DAYS[categorySelect.value]);
  // Format attendu par <input type="date"> : AAAA-MM-JJ, en heure locale
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  dateInput.value = date.getFullYear() + '-' + month + '-' + day;
}

categorySelect.addEventListener('change', suggestDate);
dateInput.addEventListener('input', () => {
  dateChangedByUser = true;
});
suggestDate();

function showStatus(text) {
  statusMessage.textContent = text;
}

// ---------- 2. Trouver le produit à partir de son code-barres ----------
// Open Food Facts est une base de données ouverte et collaborative.
const CATEGORY_RULES = [
  { category: 'dairy', tags: ['en:dairies', 'en:yogurts', 'en:cheeses', 'en:milks', 'en:butters', 'en:creams'] },
  { category: 'vegetables', tags: ['en:vegetables', 'en:fresh-vegetables', 'en:vegetables-based-foods'] },
  { category: 'fruits', tags: ['en:fruits', 'en:fresh-fruits', 'en:fruits-based-foods'] },
  { category: 'leftovers', tags: ['en:meals', 'en:prepared-meals'] },
];

function guessCategory(tags) {
  const rule = CATEGORY_RULES.find((item) => item.tags.some((tag) => tags.includes(tag)));
  return rule ? rule.category : 'grocery';
}

async function lookUpProduct(code) {
  showStatus('Code ' + code + ' lu. Recherche du produit…');
  const url = 'https://world.openfoodfacts.org/api/v2/product/' + encodeURIComponent(code)
    + '.json?fields=product_name,product_name_fr,brands,categories_tags';

  try {
    const response = await fetch(url);
    const data = await response.json();
    const product = data.product;
    const name = product && (product.product_name_fr || product.product_name);

    if (!response.ok || data.status !== 1 || !name) {
      showStatus('Code ' + code + ' lu, mais ce produit est inconnu. Saisis son nom à la main.');
      nameInput.focus();
      return;
    }

    nameInput.value = name;
    categorySelect.value = guessCategory(product.categories_tags || []);
    suggestDate();
    showStatus('Trouvé : ' + name + '. Vérifie la date limite, puis ajoute-le.');
    dateInput.focus();
  } catch (error) {
    showStatus('Impossible de chercher le produit (pas de connexion ?). Saisis son nom à la main.');
    nameInput.focus();
  }
}

// ---------- 3. Lire le code-barres : caméra ou photo ----------
// La bibliothèque ne connaît que les codes-barres alimentaires (EAN et UPC)
let scanner = null;
let libraryLoading = null;

function loadLibrary() {
  if (!libraryLoading) {
    libraryLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'vendor/html5-qrcode.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }
  return libraryLoading;
}

async function getScanner() {
  await loadLibrary();
  if (!scanner) {
    scanner = new Html5Qrcode('reader', {
      verbose: false,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
      ],
    });
  }
  return scanner;
}

async function stopCamera() {
  if (scanner && scanner.isScanning) {
    await scanner.stop();
  }
  reader.hidden = true;
  stopButton.hidden = true;
  cameraButton.hidden = false;
}

cameraButton.addEventListener('click', async () => {
  reader.hidden = false;
  cameraButton.hidden = true;
  stopButton.hidden = false;
  showStatus('Vise le code-barres, à une dizaine de centimètres.');
  try {
    const camera = await getScanner();
    await camera.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 260, height: 120 } },
      async (code) => {
        await stopCamera();
        lookUpProduct(code);
      },
    );
  } catch (error) {
    await stopCamera();
    showStatus('La caméra n\'est pas disponible. Autorise-la, ou prends une photo du code-barres.');
  }
});

stopButton.addEventListener('click', async () => {
  await stopCamera();
  showStatus('');
});

photoInput.addEventListener('change', async () => {
  const file = photoInput.files[0];
  if (!file) {
    return;
  }
  await stopCamera();
  showStatus('Lecture de la photo…');
  try {
    const photoScanner = await getScanner();
    const code = await photoScanner.scanFile(file, false);
    lookUpProduct(code);
  } catch (error) {
    showStatus('Code-barres illisible. Reprends la photo de plus près, bien à plat.');
  }
  photoInput.value = ''; // pour pouvoir reprendre une photo
});

// ---------- 4. Ajouter le produit au frigo ----------
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const saved = saveProduct({
    name: nameInput.value.trim(),
    category: categorySelect.value,
    date: dateInput.value,
  });
  if (saved) {
    window.location.href = 'fridge.html';
  } else {
    showStatus('Impossible d\'enregistrer sur cet appareil (navigation privée ?).');
  }
});
