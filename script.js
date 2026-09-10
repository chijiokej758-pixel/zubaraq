/* =========================================================
   ZUBARAQ — MAIN JAVASCRIPT
   Marketplace + Supabase Auth + Account
   ========================================================= */

const SUPABASE_URL = "https://bnltctuqrinhhggjnksr.supabase.co";

/*
  KEEP YOUR EXISTING SUPABASE PUBLISHABLE KEY HERE.
  Do NOT use the service_role/secret key.
*/
const SUPABASE_KEY = "sb_publishable_YKVkY0UIjbYoxafgaNv-0A_ajI7NS6u";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

/* =========================================================
   DEMO MARKETPLACE PRODUCTS
   ========================================================= */

const products = [
  {
    id: "solar-panels",
    name: "Monocrystalline Solar Panels 450W",
    price: 85,
    unit: "unit",
    moq: 50,
    supplier: "Oasis Solar Ltd.",
    location: "Lagos, Nigeria",
    category: "Energy",
    description:
      "High-efficiency monocrystalline solar panels suitable for homes, businesses and large solar installations."
  },
  {
    id: "ankara-fabric",
    name: "Premium Wax Print Ankara Fabric",
    price: 4.2,
    unit: "yard",
    moq: 100,
    supplier: "Kente & Co. Textiles",
    location: "Accra, Ghana",
    category: "Textiles",
    description:
      "Premium African wax print fabric suitable for fashion brands, wholesalers and clothing manufacturers."
  },
  {
    id: "cocoa-beans",
    name: "Premium Cocoa Beans — Grade 1",
    price: 2480,
    unit: "tonne",
    moq: 10,
    supplier: "Gold Coast Commodities",
    location: "Kumasi, Ghana",
    category: "Agriculture",
    description:
      "Export-grade cocoa beans sourced from trusted West African producers."
  },
  {
    id: "shea-butter",
    name: "Organic Unrefined Shea Butter",
    price: 6.8,
    unit: "kg",
    moq: 50,
    supplier: "Savanna Naturals",
    location: "Tamale, Ghana",
    category: "Beauty",
    description:
      "Organic unrefined shea butter for cosmetics, skincare and manufacturing."
  },
  {
    id: "cement",
    name: "Portland Cement 42.5R",
    price: 9.5,
    unit: "bag",
    moq: 500,
    supplier: "BuildRight Materials",
    location: "Nairobi, Kenya",
    category: "Construction",
    description:
      "High-strength Portland cement for commercial and residential construction."
  },
  {
    id: "office-chairs",
    name: "Ergonomic Mesh Office Chairs",
    price: 72,
    unit: "piece",
    moq: 20,
    supplier: "Nile Workspace",
    location: "Cairo, Egypt",
    category: "Office",
    description:
      "Comfortable ergonomic mesh office chairs designed for businesses and workspaces."
  },
  {
    id: "generator",
    name: "45kVA Silent Diesel Generator",
    price: 6200,
    unit: "unit",
    moq: 1,
    supplier: "PowerPro Africa",
    location: "Lagos, Nigeria",
    category: "Energy",
    description:
      "Reliable silent diesel generator for businesses, offices and commercial facilities."
  },
  {
    id: "brake-pads",
    name: "Ceramic Brake Pads - Toyota Hiace",
    price: 28,
    unit: "set",
    moq: 25,
    supplier: "MobiParts Kenya",
    location: "Mombasa, Kenya",
    category: "Automotive",
    description:
      "Durable ceramic brake pads for Toyota Hiace vehicles."
  },
  {
    id: "shipping-boxes",
    name: "Custom Kraft Shipping Boxes",
    price: 0.42,
    unit: "box",
    moq: 1000,
    supplier: "Pack Africa",
    location: "Johannesburg, South Africa",
    category: "Packaging",
    description:
      "Custom kraft packaging boxes for e-commerce brands, retailers and manufacturers."
  },
  {
    id: "thermal-paper",
    name: "POS Thermal Paper Rolls",
    price: 1.15,
    unit: "roll",
    moq: 200,
    supplier: "Deskwise Supplies",
    location: "Kigali, Rwanda",
    category: "Office",
    description:
      "High-quality thermal paper rolls for POS terminals and receipt printers."
  }
];

/* =========================================================
   HELPERS
   ========================================================= */

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPrice(price) {
  return "$" + Number(price).toLocaleString("en-US", {
    minimumFractionDigits: price < 10 ? 2 : 0,
    maximumFractionDigits: 2
  });
}

function showToast(message) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/* =========================================================
   REMOVE OLD AUTH UI
   ========================================================= */

function removeOldAuthUI() {
  document.getElementById("auth-buttons")?.remove();
  document.getElementById("auth-modal")?.remove();
}

/* =========================================================
   PRODUCT MARKETPLACE
   ========================================================= */

function renderProducts(list = products) {
  const grid = document.querySelector(".product-grid");

  if (!grid) return;

  grid.innerHTML = list.map(product => `
    <article class="product-card">
      <div class="product-image">
        <div class="product-image-placeholder">
          ${escapeHTML(product.category)}
        </div>
      </div>

      <div class="product-content">
        <div class="product-category">
          ${escapeHTML(product.category)}
        </div>

        <h3>${escapeHTML(product.name)}</h3>

        <div class="product-price">
          ${formatPrice(product.price)}
          <span>/${escapeHTML(product.unit)}</span>
        </div>

        <div class="product-meta">
          <span>MOQ: ${product.moq} ${escapeHTML(product.unit)}${product.moq === 1 ? "" : "s"}</span>
        </div>

        <div class="product-supplier">
          <strong>${escapeHTML(product.supplier)}</strong>
          <span>${escapeHTML(product.location)}</span>
        </div>

        <button
          class="button button-small product-view-button"
          data-product-id="${escapeHTML(product.id)}"
        >
          View Product
        </button>
      </div>
    </article>
  `).join("");
}

function openProduct(productId) {
  const product = products.find(item => item.id === productId);

  if (!product) return;

  closeModal("product-modal");

  const modal = document.createElement("div");
  modal.id = "product-modal";
  modal.className = "zubaraq-modal";

  modal.innerHTML = `
    <div class="modal-box product-modal-box">
      <button class="modal-close" onclick="closeModal('product-modal')">
        ×
      </button>

      <div class="auth-header">
        <div class="auth-logo">Z</div>
        <h2>${escapeHTML(product.name)}</h2>
        <p class="modal-subtitle">
          ${escapeHTML(product.supplier)} · ${escapeHTML(product.location)}
        </p>
      </div>

      <p>${escapeHTML(product.description)}</p>

      <div class="product-detail-info">
        <div>
          <strong>Price</strong>
          <span>${formatPrice(product.price)} / ${escapeHTML(product.unit)}</span>
        </div>

        <div>
          <strong>Minimum Order</strong>
          <span>${product.moq} ${escapeHTML(product.unit)}${product.moq === 1 ? "" : "s"}</span>
        </div>

        <div>
          <strong>Category</strong>
          <span>${escapeHTML(product.category)}</span>
        </div>

        <div>
          <strong>Supplier</strong>
          <span>${escapeHTML(product.supplier)}</span>
        </div>
      </div>

      <button class="button" onclick="startOrder('${product.id}')">
        Contact Supplier
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      closeModal("product-modal");
    }
  });
}

function startOrder(productId) {
  const product = products.find(item => item.id === productId);

  if (!product) return;

  supabaseClient.auth.getUser().then(({ data }) => {
    if (!data.user) {
      closeModal("product-modal");
      showAuth("login");
      showToast("Please log in to continue.");
      return;
    }

    closeModal("product-modal");

    showToast(
      `Supplier contact for ${product.name} will be available in the next marketplace update.`
    );
  });
}

function closeModal(id) {
  document.getElementById(id)?.remove();
}

/* =========================================================
   AUTH MODAL
   ========================================================= */

function showAuth(mode = "login") {
  closeModal("auth-modal");

  const signup = mode === "signup";

  const modal = document.createElement("div");
  modal.id = "auth-modal";
  modal.className = "zubaraq-modal";

  modal.innerHTML = `
    <div class="modal-box">

      <button class="modal-close" onclick="closeModal('auth-modal')">
        ×
      </button>

      <div class="auth-header">
        <div class="auth-logo">Z</div>

        <h2>
          ${signup ? "Create your ZUBARAQ account" : "Welcome back"}
        </h2>

        <p>
          ${
            signup
              ? "Join businesses trading across Africa."
              : "Log in to your ZUBARAQ account."
          }
        </p>
      </div>

      <form id="auth-form">

        ${
          signup
            ? `
          <div class="form-group">
            <label for="auth-name">Full Name</label>
            <input
              id="auth-name"
              type="text"
              placeholder="Your full name"
              required
            >
          </div>

          <div class="form-group">
            <label for="auth-country">Country</label>
            <input
              id="auth-country"
              type="text"
              value="Nigeria"
              placeholder="Country"
            >
          </div>
        `
            : ""
        }

        <div class="form-group">
          <label for="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            placeholder="you@example.com"
            required
          >
        </div>

        <div class="form-group">
          <label for="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            placeholder="Minimum 6 characters"
            minlength="6"
            required
          >
        </div>

        <button
          type="submit"
          class="button"
          id="auth-submit"
          style="width:100%;"
        >
          ${signup ? "Create Account" : "Log In"}
        </button>

      </form>

      <p class="auth-switch">
        ${
          signup
            ? "Already have an account?"
            : "Don't have an account?"
        }

        <button type="button" id="auth-switch-button">
          ${signup ? "Log In" : "Sign Up"}
        </button>
      </p>

    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("auth-form").addEventListener("submit", event => {
    event.preventDefault();

    if (signup) {
      signUp();
    } else {
      logIn();
    }
  });

  document
    .getElementById("auth-switch-button")
    .addEventListener("click", () => {
      closeModal("auth-modal");
      showAuth(signup ? "login" : "signup");
    });

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      closeModal("auth-modal");
    }
  });
}

/* =========================================================
   SIGN UP
   ========================================================= */

async function signUp() {
  const name = document.getElementById("auth-name")?.value.trim();
  const email = document.getElementById("auth-email")?.value.trim();
  const password = document.getElementById("auth-password")?.value;
  const country =
    document.getElementById("auth-country")?.value.trim() || "Nigeria";

  const button = document.getElementById("auth-submit");

  if (!name || !email || !password) {
    showToast("Please complete all required fields.");
    return;
  }

  if (password.length < 6) {
    showToast("Password must be at least 6 characters.");
    return;
  }

  button.disabled = true;
  button.textContent = "Creating account...";

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        country,
        role: "buyer"
      }
    }
  });

  button.disabled = false;
  button.textContent = "Create Account";

  if (error) {
    showToast(error.message);
    return;
  }

  closeModal("auth-modal");

  if (data.session) {
    showToast("Account created successfully. Welcome to ZUBARAQ!");
  } else {
    showToast(
      "Account created. Check your email if confirmation is required."
    );
  }

  updateNavigation();
}

/* =========================================================
   LOGIN
   ========================================================= */

async function logIn() {
  const email = document.getElementById("auth-email")?.value.trim();
  const password = document.getElementById("auth-password")?.value;

  const button = document.getElementById("auth-submit");

  if (!email || !password) {
    showToast("Enter your email and password.");
    return;
  }

  button.disabled = true;
  button.textContent = "Logging in...";

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  button.disabled = false;
  button.textContent = "Log In";

  if (error) {
    showToast(error.message);
    return;
  }

  closeModal("auth-modal");

  showToast("Welcome back to ZUBARAQ!");

  updateNavigation();
}

/* =========================================================
   LOGOUT
   ========================================================= */

async function logOut() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    showToast(error.message);
    return;
  }

  closeModal("account-modal");

  showToast("You have been logged out.");

  updateNavigation();
}

/* =========================================================
   ACCOUNT DASHBOARD
   ========================================================= */

async function showAccount() {
  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user) {
    showAuth("login");
    return;
  }

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  closeModal("account-modal");

  const name =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    "ZUBARAQ User";

  const email = user.email || "";

  const country =
    profile?.country ||
    user.user_metadata?.country ||
    "Nigeria";

  const role = profile?.role || "buyer";

  const initial = name.charAt(0).toUpperCase();

  const modal = document.createElement("div");

  modal.id = "account-modal";
  modal.className = "zubaraq-modal";

  modal.innerHTML = `
    <div class="modal-box account-box">

      <button
        class="modal-close"
        onclick="closeModal('account-modal')"
      >
        ×
      </button>

      <div class="account-header">
        <div class="account-avatar">${escapeHTML(initial)}</div>

        <div>
          <h2>${escapeHTML(name)}</h2>
          <p>${escapeHTML(email)}</p>
        </div>
      </div>

      <div class="account-tabs">
        <button
          class="account-tab active"
          data-tab="profile"
        >
          Profile
        </button>

        <button
          class="account-tab"
          data-tab="orders"
        >
          Orders
        </button>

        <button
          class="account-tab"
          data-tab="supplier"
        >
          Supplier
        </button>
      </div>

      <div id="account-content">

        <div class="account-section">
          <h3>Account Information</h3>

          <div class="account-info-row">
            <span>Full Name</span>
            <strong>${escapeHTML(name)}</strong>
          </div>

          <div class="account-info-row">
            <span>Email</span>
            <strong>${escapeHTML(email)}</strong>
          </div>

          <div class="account-info-row">
            <span>Country</span>
            <strong>${escapeHTML(country)}</strong>
          </div>

          <div class="account-info-row">
            <span>Account Type</span>
            <strong>${escapeHTML(role)}</strong>
          </div>
        </div>

        <button class="account-logout" onclick="logOut()">
          Log Out
        </button>

      </div>

    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      closeModal("account-modal");
    }
  });

  modal.querySelectorAll(".account-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      modal
        .querySelectorAll(".account-tab")
        .forEach(item => item.classList.remove("active"));

      tab.classList.add("active");

      const selected = tab.dataset.tab;

      if (selected === "profile") {
        showProfileContent(profile, user);
      }

      if (selected === "orders") {
        showOrdersContent(user);
      }

      if (selected === "supplier") {
        showSupplierContent(user);
      }
    });
  });
}

/* =========================================================
   PROFILE TAB
   ========================================================= */

function showProfileContent(profile, user) {
  const content = document.getElementById("account-content");

  if (!content) return;

  const name =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    "ZUBARAQ User";

  const country =
    profile?.country ||
    user.user_metadata?.country ||
    "Nigeria";

  const role = profile?.role || "buyer";

  content.innerHTML = `
    <div class="account-section">
      <h3>Account Information</h3>

      <div class="account-info-row">
        <span>Full Name</span>
        <strong>${escapeHTML(name)}</strong>
      </div>

      <div class="account-info-row">
        <span>Email</span>
        <strong>${escapeHTML(user.email)}</strong>
      </div>

      <div class="account-info-row">
        <span>Country</span>
        <strong>${escapeHTML(country)}</strong>
      </div>

      <div class="account-info-row">
        <span>Account Type</span>
        <strong>${escapeHTML(role)}</strong>
      </div>
    </div>

    <button class="account-logout" onclick="logOut()">
      Log Out
    </button>
  `;
}

/* =========================================================
   ORDERS TAB
   ========================================================= */

async function showOrdersContent(user) {
  const content = document.getElementById("account-content");

  if (!content) return;

  content.innerHTML = `
    <div class="account-section">
      <h3>My Orders</h3>
      <p class="modal-subtitle">Loading your orders...</p>
    </div>
  `;

  const { data: orders, error } = await supabaseClient
    .from("orders")
    .select("*")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    content.innerHTML = `
      <div class="empty-account">
        <div class="empty-icon">⚠️</div>
        <h3>Unable to load orders</h3>
        <p>${escapeHTML(error.message)}</p>
      </div>
    `;
    return;
  }

  if (!orders || orders.length === 0) {
    content.innerHTML = `
      <div class="empty-account">
        <div class="empty-icon">📦</div>
        <h3>No orders yet</h3>
        <p>Your ZUBARAQ orders will appear here.</p>
      </div>
    `;
    return;
  }

  content.innerHTML = `
    <div class="account-section">
      <h3>My Orders</h3>

      ${orders.map(order => `
        <div class="order-c