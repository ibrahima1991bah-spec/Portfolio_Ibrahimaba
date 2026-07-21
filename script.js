const products = [
  {
    id: 1,
    name: 'Écouteurs sans fil',
    price: 5000,
    description: 'Audio immersif avec autonomie jusqu’à 30 heures.',
    tag: 'Meilleure vente',
    icon: '🎧'
  },
  {
    id: 2,
    name: 'Sac de voyage',
    price: 4000,
    description: 'Design moderne, compartiments spacieux et résistant.',
    tag: 'Nouveau',
    icon: '🎒'
  },
  {
    id: 3,
    name: 'Montre connectée',
    price: 8000,
    description: 'Suivi du sport, notifications intelligentes et batterie longue durée.',
    tag: 'Populaire',
    icon: '⌚'
  },
  {
    id: 4,
    name: 'Lampe d’ambiance',
    price: 3200,
    description: 'Éclairage doux et réglable pour votre espace de travail.',
    tag: 'Offre spéciale',
    icon: '💡'
  }
];

const cart = [];

const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const totalPrice = document.getElementById('totalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');
const contactForm = document.getElementById('contactForm');
const customerNameInput = document.getElementById('customerName');
const customerPhoneInput = document.getElementById('customerPhone');
const deliveryAddressInput = document.getElementById('deliveryAddress');

function formatPrice(value) {
  return `${value.toLocaleString('fr-FR')} XOF`;
}

function renderProducts() {
  productGrid.innerHTML = products.map((product) => `
    <article class="product-card">
      <span class="tag">${product.tag}</span>
      <div class="product-icon">${product.icon}</div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="price">${formatPrice(product.price)}</div>
      <button class="btn btn-primary add-to-cart" data-id="${product.id}">Ajouter au panier</button>
    </article>
  `).join('');
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Votre panier est vide pour le moment.</p>';
    cartCount.textContent = '0';
    totalPrice.textContent = '0 XOF';
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>${formatPrice(item.price)} × ${item.quantity}</span>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-controls">
          <button class="cart-qty-btn" data-id="${item.id}" data-action="decrease">-</button>
          <span>${item.quantity}</span>
          <button class="cart-qty-btn" data-id="${item.id}" data-action="increase">+</button>
        </div>
        <button class="remove-btn" data-id="${item.id}">Supprimer</button>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  totalPrice.textContent = formatPrice(total);
}

function addToCart(id) {
  const product = products.find((item) => item.id === Number(id));
  if (!product) return;

  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
}

function updateQuantity(id, change) {
  const item = cart.find((entry) => entry.id === Number(id));
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  renderCart();
}

function removeFromCart(id) {
  const index = cart.findIndex((item) => item.id === Number(id));
  if (index === -1) return;

  cart.splice(index, 1);
  renderCart();
}

function isValidPhone(phone) {
  return /^\+?\d[\d\s-]{7,}$/.test(phone.trim());
}

function buildWhatsAppMessage() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemsList = cart
    .map((item) => `${item.quantity} × ${item.name} (${formatPrice(item.price)})`)
    .join('\n');

  const text = `Bonjour Ibrahima,\n\nJe souhaite passer commande via votre site.\n\nProduits:\n${itemsList}\n\nTotal: ${formatPrice(total)}\n\nNom: ${customerNameInput.value.trim()}\nTéléphone WhatsApp: ${customerPhoneInput.value.trim()}\nAdresse de livraison: ${deliveryAddressInput.value.trim()}\n\nJ'utilise Wave pour le paiement. Merci de confirmer la commande.`;
  return encodeURIComponent(text);
}

productGrid.addEventListener('click', (event) => {
  const button = event.target.closest('.add-to-cart');
  if (button) {
    addToCart(button.dataset.id);
  }
});

cartItems.addEventListener('click', (event) => {
  const removeButton = event.target.closest('.remove-btn');
  if (removeButton) {
    removeFromCart(removeButton.dataset.id);
    return;
  }

  const qtyButton = event.target.closest('.cart-qty-btn');
  if (qtyButton) {
    const action = qtyButton.dataset.action;
    updateQuantity(qtyButton.dataset.id, action === 'increase' ? 1 : -1);
  }
});

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Votre panier est vide. Ajoutez un produit avant de commander.');
    return;
  }

  const name = customerNameInput.value.trim();
  const phone = customerPhoneInput.value.trim();
  const address = deliveryAddressInput.value.trim();

  if (!name || !phone || !address) {
    alert('Merci de renseigner votre nom, téléphone et adresse de livraison.');
    return;
  }

  if (!isValidPhone(phone)) {
    alert('Merci de saisir un numéro WhatsApp valide.');
    return;
  }

  const whatsappUrl = `https://wa.me/221785698458?text=${buildWhatsAppMessage()}`;
  window.open(whatsappUrl, '_blank', 'noopener');
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Merci pour votre message. Nous vous répondrons rapidement.');
  contactForm.reset();
});

renderProducts();
renderCart();
