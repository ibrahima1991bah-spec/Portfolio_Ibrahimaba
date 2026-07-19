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
      <div>
        <strong>${item.name}</strong>
        <span>${formatPrice(item.price)} × ${item.quantity}</span>
      </div>
      <button class="remove-btn" data-id="${item.id}">Supprimer</button>
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

function removeFromCart(id) {
  const index = cart.findIndex((item) => item.id === Number(id));
  if (index === -1) return;

  cart.splice(index, 1);
  renderCart();
}

productGrid.addEventListener('click', (event) => {
  const button = event.target.closest('.add-to-cart');
  if (button) {
    addToCart(button.dataset.id);
  }
});

cartItems.addEventListener('click', (event) => {
  const button = event.target.closest('.remove-btn');
  if (button) {
    removeFromCart(button.dataset.id);
  }
});

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Votre panier est vide. Ajoutez un produit avant de commander.');
    return;
  }

  alert('Commande reçue ! Nous vous contacterons très bientôt pour la confirmation.');
  cart.length = 0;
  renderCart();
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Merci pour votre message. Nous vous répondrons rapidement.');
  contactForm.reset();
});

renderProducts();
renderCart();
console.log('Boutique VibeStore prête à être utilisée.');
