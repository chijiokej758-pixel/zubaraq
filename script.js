const SUPABASE_URL = "https://bnltctuqrinhhggjnksr.supabase.co";
const SUPABASE_KEY = "sb_publishable_YKVkY0UIjbYoxafgaNv-0A_ajI7NS6u";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// =========================================
// ZUBARAQ BASIC UI
// =========================================

const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const toast = document.querySelector('#toast');

let toastTimer;

const marketplaceSearch = document.querySelector('#marketplace-search');
const categoryFilter = document.querySelector('#category-filter');
const sortProducts = document.querySelector('#sort-products');
const productGrid = document.querySelector('#product-grid');
const productDetail = document.querySelector('#product-detail');
const emptyState = document.querySelector('#empty-state');
const marketplaceCount = document.querySelector('#marketplace-count');
const clearFilters = document.querySelector('#clear-filters');

const products = [
  {
    id: 'solar-panels',
    name: 'Monocrystalline Solar Panels 450W',
    category: 'Electronics',
    price: 85,
    unit: 'unit',
    moq: '50 units',
    supplier: 'Oasis Solar Ltd.',
    initials: 'OS',
    location: 'Lagos, Nigeria',
    badge: 'Top seller',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=85',
    description: 'High-efficiency 450W panels built for commercial rooftops, mini-grids, and reliable off-grid power across Africa.'
  },
  {
    id: 'ankara-fabric',
    name: 'Premium Wax Print Ankara Fabric',
    category: 'Fashion & Clothing',
    price: 4.2,
    unit: 'yard',
    moq: '100 yards',
    supplier: 'Kente & Co. Textiles',
    initials: 'KC',
    location: 'Accra, Ghana',
    badge: 'New arrival',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85',
    description: 'Richly patterned wax print fabric with colorfast finishing, ideal for fashion labels, uniforms, and retail collections.'
  },
  {
    id: 'cocoa-beans',
    name: 'Premium Cocoa Beans - Grade 1',
    category: 'Food & Agriculture',
    price: 2480,
    unit: 'tonne',
    moq: '5 tonnes',
    supplier: 'Gold Coast Commodities',
    initials: 'GC',
    location: 'Kumasi, Ghana',
    badge: 'In demand',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=900&q=85',
    description: 'Carefully sorted Grade 1 cocoa beans sourced from established farmer cooperatives and prepared for export.'
  },
  {
    id: 'shea-butter',
    name: 'Organic Unrefined Shea Butter',
    category: 'Beauty & Cosmetics',
    price: 6.8,
    unit: 'kg',
    moq: '50 kg',
    supplier: 'Savanna Naturals',
    initials: 'SN',
    location: 'Tamale, Ghana',
    badge: 'Organic',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85',
    description: 'Traceable, unrefined shea butter for skincare, haircare, and cosmetic manufacturing with a smooth natural finish.'
  },
  {
    id: 'cement-blocks',
    name: 'Portland Cement 42.5R',
    category: 'Building Materials',
    price: 9.5,
    unit: 'bag',
    moq: '500 bags',
    supplier: 'BuildRight Materials',
    initials: 'BM',
    location: 'Nairobi, Kenya',
    badge: 'Bulk ready',
    image: 'https://images.unsplash.com/photo-1503387762-592dea58ef25?auto=format&fit=crop&w=900&q=85',
    description: 'Consistent high-strength cement for commercial construction, infrastructure, and residential projects.'
  },
  {
    id: 'office-chairs',
    name: 'Ergonomic Mesh Office Chairs',
    category: 'Home & Furniture',
    price: 72,
    unit: 'piece',
    moq: '20 pieces',
    supplier: 'Nile Workspace',
    initials: 'NW',
    location: 'Cairo, Egypt',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=85',
    description: 'Adjustable mesh-backed office chairs designed for comfortable, productive workspaces and bulk office fit-outs.'
  },
  {
    id: 'diesel-generator',
    name: '45kVA Silent Diesel Generator',
    category: 'Industrial Equipment',
    price: 6200,
    unit: 'unit',
    moq: '1 unit',
    supplier: 'PowerPro Africa',
    initials: 'PA',
    location: 'Lagos, Nigeria',
    badge: 'Verified stock',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=85',
    description: 'Commercial-grade backup power with low-noise housing, automatic transfer compatibility, and local service support.'
  },
  {
    id: 'brake-pads',
    name: 'Ceramic Brake Pads - Toyota Hiace',
    category: 'Auto Parts',
    price: 28,
    unit: 'set',
    moq: '25 sets',
    supplier: 'MobiParts Kenya',
    initials: 'MK',
    location: 'Mombasa, Kenya',
    badge: 'Fast moving',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=85',
    description: 'Durable low-dust ceramic brake pad sets with dependable stopping performance for fleet and workshop buyers.'
  },
  {
    id: 'kraft-boxes',
    name: 'Custom Kraft Shipping Boxes',
    category: 'Packaging',
    price: 0.42,
    unit: 'box',
    moq: '1,000 boxes',
    supplier: 'Pack Africa',
    initials: 'PA',
    location: 'Johannesburg, South Africa',
    badge: 'Customizable',
    image: 'https://images.unsplash.com/photo-1586528116493-da8b9a7e2a9c?auto=format&fit=crop&w=900&q=85',
    description: 'Recyclable kraft boxes available in custom sizes and printed finishes for growing retail and e-commerce brands.'
  },
  {
    id: 'thermal-paper',
    name: 'POS Thermal Paper Rolls',
    category: 'Office Supplies',
    price: 1.15,
    unit: 'roll',
    moq: '200 rolls',
    supplier: 'Deskwise Supplies',
    initials: 'DS',
    location: 'Kigali, Rwanda',
    badge: 'Best value',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=85',
    description: 'Reliable BPA-free thermal paper rolls compatible with standard POS terminals, printers, and retail counters.'
  }
];

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  window.clearTimeout(toastTimer);

  toastTimer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function formatPrice(product) {
  return `$${product.price.toLocaleString('en-US', {
    minimumFractionDigits: product.price < 10 ? 2 : 0,
    maximumFractionDigits: 2
  })}`;
}

function productCard(product) {
  return `
    <article class="product-card" data-product-id="${product.id}">
      <button class="product-open" type="button" aria-label="View ${product.name}">
        <div class="product-image" style="background-image:url('${product.image}');background-size:cover;background-position:center;">
          <span class="product-badge">${product.badge}</span>
        </div>

        <div class="product-info">
          <p class="product-location">
            ${product.location} <span>•</span> ${product.category}
          </p>

          <h3>${product.name}</h3>

          <div class="product-price">
            <strong>${formatPrice(product)} <small>/ ${product.unit}</small></strong>
            <span>MOQ: ${product.moq}</span>
          </div>

          <div class="supplier-row">
            <span class="supplier-avatar avatar-teal">${product.initials}</span>
            <span>${product.supplier}</span>
            <span class="verified">✓ Verified</span>
          </div>
        </div>
      </button>
    </article>
  `;
}

function renderProducts() {
  if (!marketplaceSearch || !categoryFilter || !sortProducts) return;

  const query = marketplaceSearch.value.trim().toLowerCase();
  const category = categoryFilter.value;

  let filtered = products.filter((product) => {
    const searchable =
      `${product.name} ${product.category} ${product.supplier}`.toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (category === 'all' || product.category === category)
    );
  });

  if (sortProducts.value === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sortProducts.value === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  }

  productGrid.innerHTML = filtered.map(productCard).join('');
  productGrid.hidden = filtered.length === 0;
  emptyState.hidden = filtered.length !== 0;

  marketplaceCount.textContent =
    `${filtered.length} product${filtered.length === 1 ? '' : 's'}`;
}

function getCart() {
  return JSON.parse(localStorage.getItem('zubaraq_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('zubaraq_cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      quantity: 1
    });
  }

  saveCart(cart);
  showToast(`${product.name} added to cart.`);
}

function updateCartCount() {
  const count = getCart().reduce(
    (total, item) => total + item.quantity,
    0
  );

  const badge = document.querySelector('#cart-count');

  if (badge) {
    badge.textContent = count;
    badge.hidden = count === 0;
  }
}

function openProduct(productId) {
  const product = products.find((item) => item.id === productId);

  if (!product) return;

  productDetail.innerHTML = `
    <button class="detail-back" type="button">
      ← Back to marketplace
    </button>

    <div class="detail-layout">
      <div
        class="detail-image"
        style="background-image:url('${product.image}');background-size:cover;background-position:center;"
      >
        <span class="product-badge">${product.badge}</span>
      </div>

      <div class="detail-copy">
        <p class="kicker">${product.category}</p>
        <h2>${product.name}</h2>

        <p class="detail-description">
          ${product.description}
        </p>

        <div class="detail-price">
          <strong>${formatPrice(product)}</strong>
          <span>/ ${product.unit}</span>
        </div>

        <dl class="detail-facts">
          <div>
            <dt>Minimum order</dt>
            <dd>${product.moq}</dd>
          </div>

          <div>
            <dt>Supplier</dt>
            <dd>${product.supplier}</dd>
          </div>

          <div>
            <dt>Location</dt>
            <dd>${product.location}</dd>
          </div>

          <div>
            <dt>Verification</dt>
            <dd class="verified">✓ Verified supplier</dd>
          </div>
        </dl>

        <div class="detail-actions">
          <button class="button" type="button" data-action="cart">
            Add to Cart
          </button>

          <button class="button button-secondary" type="button" data-action="quote">
            Request Quote
          </button>

          <button class="button button-secondary" type="button" data-action="contact">
            Contact Supplier
          </button>
        </div>
      </div>
    </div>
  `;

  productGrid.hidden = true;
  emptyState.hidden = true;
  productDetail.hidden = false;

  productDetail.dataset.currentProduct = product.id;

  productDetail.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

if (marketplaceSearch) {
  marketplaceSearch.addEventListener('input', renderProducts);
}

if (sortProducts) {
  sortProducts.addEventListener('change', renderProducts);
}

if (categoryFilter) {
  categoryFilter.addEventListener('change', () => {
    document.querySelectorAll('.category-pill').forEach((pill) => {
      pill.classList.toggle(
        'active',
        pill.dataset.category === categoryFilter.value
      );
    });

    renderProducts();
  });
}

document.querySelectorAll('.category-pill').forEach((pill) => {
  pill.addEventListener('click', () => {
    categoryFilter.value = pill.dataset.category;

    document.querySelectorAll('.category-pill').forEach((item) => {
      item.classList.toggle('active', item === pill);
    });

    renderProducts();
  });
});

if (productGrid) {
  productGrid.addEventListener('click', (event) => {
    const card = event.target.closest('[data-product-id]');

    if (card) {
      openProduct(card.dataset.productId);
    }
  });
}

if (productDetail) {
  productDetail.addEventListener('click', (event) => {
    if (event.target.closest('.detail-back')) {
      productDetail.hidden = true;
      renderProducts();

      productGrid.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      return;
    }

    const action =
      event.target.closest('[data-action]')?.dataset.action;

    if (action === 'cart') {
      const product = products.find(
        (item) => item.id === productDetail.dataset.currentProduct
      );

      if (product) {
        addToCart(product);
      }
    }

    if (action === 'quote') {
      showToast('Quote request feature is being prepared.');
    }

    if (action === 'contact') {
      showToast('Supplier messaging is coming next.');
    }
  });
}

if (clearFilters) {
  clearFilters.addEventListener('click', () => {
    marketplaceSearch.value = '';
    categoryFilter.value = 'all';
    sortProducts.value = 'recommended';

    document.querySelectorAll('.category-pill').forEach((pill) => {
      pill.classList.toggle(
        'active',
        pill.dataset.category === 'all'
      );
    });

    renderProducts();
  });
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');

    menuToggle.setAttribute(
      'aria-expanded',
      String(isOpen)
    );

    menuToggle.setAttribute(
      'aria-label',
      isOpen ? 'Close menu' : 'Open menu'
    );
  });
}

document.querySelectorAll('.nav-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');

    menuToggle.setAttribute(
      'aria-expanded',
      'false'
    );

    menuToggle.setAttribute(
      'aria-label',
      'Open menu'
    );
  });
});

if (searchForm) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();

    if (query) {
      marketplaceSearch.value = query;
      renderProducts();

      document
        .querySelector('#marketplace')
        ?.scrollIntoView({
          behavior: 'smooth'
        });
    } else {
      showToast('Try searching for a product or supplier.');
    }
  });
}

renderProducts();
updateCartCount();

// =========================================
// ZUBARAQ AUTHENTICATION
// =========================================

async function signUpUser(
  email,
  password,
  fullName,
  role = 'buyer'
) {
  const { data, error } =
    await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          country: 'Nigeria'
        }
      }
    });

  if (error) {
    showToast(error.message);
    return null;
  }

  showToast('Account created successfully!');

  return data;
}

async function loginUser(email, password) {
  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    showToast(error.message);
    return null;
  }

  showToast('Welcome back to ZUBARAQ!');

  closeAuth();
  showLoggedInUser(data.user);

  return data;
}

async function logoutUser() {
  const { error } =
    await supabaseClient.auth.signOut();

  if (error) {
    showToast(error.message);
    return;
  }

  closeDashboard();

  showToast('You have been logged out.');

  setTimeout(() => {
    location.reload();
  }, 700);
}

// =========================================
// AUTH MODAL
// =========================================

let authMode = 'login';

function showAuth(mode) {
  authMode = mode;

  const modal =
    document.getElementById('auth-modal');

  if (!modal) return;

  modal.style.display = 'flex';

  document.getElementById('auth-title').textContent =
    mode === 'login'
      ? 'Login to ZUBARAQ'
      : 'Create ZUBARAQ Account';

  document.getElementById('auth-submit').textContent =
    mode === 'login'
      ? 'Login'
      : 'Sign Up';

  document.getElementById('auth-name').style.display =
    mode === 'signup'
      ? 'block'
      : 'none';
}

function closeAuth() {
  const modal =
    document.getElementById('auth-modal');

  if (modal) {
    modal.style.display = 'none';
  }
}

function switchAuth() {
  showAuth(
    authMode === 'login'
      ? 'signup'
      : 'login'
  );
}

async function submitAuth() {
  const email =
    document.getElementById('auth-email')
      .value
      .trim();

  const password =
    document.getElementById('auth-password')
      .value
      .trim();

  const fullName =
    document.getElementById('auth-name')
      .value
      .trim();

  if (!email || !password) {
    showToast(
      'Please enter your email and password.'
    );
    return;
  }

  if (authMode === 'signup') {
    if (!fullName) {
      showToast(
        'Please enter your full name.'
      );
      return;
    }

    const result = await signUpUser(
      email,
      password,
      fullName
    );

    if (result?.user) {
      showAuth('login');
    }

    return;
  }

  await loginUser(email, password);
}

// =========================================
// ZUBARAQ ACCOUNT DASHBOARD
// =========================================

function createDashboard() {
  if (document.getElementById('zubaraq-dashboard')) {
    return;
  }

  const dashboard = document.createElement('div');

  dashboard.id = 'zubaraq-dashboard';

  dashboard.innerHTML = `
    <div class="dashboard-overlay" data-dashboard-close></div>

    <aside class="dashboard-panel">

      <button
        class="dashboard-close"
        type="button"
        data-dashboard-close
      >
        ✕
      </button>

      <div class="dashboard-header">
        <span class="brand-mark">Z</span>

        <div>
          <strong>ZUBARAQ</strong>
          <small>Business Account</small>
        </div>
      </div>

      <div class="dashboard-user">
        <div class="dashboard-avatar" id="dashboard-avatar">
          Z
        </div>

        <div>
          <strong id="dashboard-name">
            User
          </strong>

          <small id="dashboard-email">
            —
          </small>
        </div>
      </div>

      <nav class="dashboard-nav">

        <button
          class="dashboard-nav-item active"
          data-tab="overview"
        >
          🏠 Overview
        </button>

        <button
          class="dashboard-nav-item"
          data-tab="profile"
        >
          👤 My Profile
        </button>

        <button
          class="dashboard-nav-item"
          data-tab="orders"
        >
          📦 My Orders
        </button>

        <button
          class="dashboard-nav-item"
          data-tab="supplier"
        >
          🏪 Become a Supplier
        </button>

        <button
          class="dashboard-nav-item"
          data-tab="cart"
        >
          🛒 My Cart
          <span id="cart-count">0</span>
        </button>

      </nav>

      <button
        class="dashboard-logout"
        onclick="logoutUser()"
      >
        Log out
      </button>

      <div class="dashboard-content">

        <section
          class="dashboard-tab active"
          id="tab-overview"
        >
          <p class="kicker">Your ZUBARAQ account</p>

          <h2>Welcome to your dashboard.</h2>

          <div class="dashboard-cards">

            <div class="dashboard-card">
              <span>📦</sp