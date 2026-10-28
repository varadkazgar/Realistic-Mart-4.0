import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { getActiveProducts } from "./services/product.service";

const categories = [
  { name: "All Products", emoji: "✦" },
  { name: "Electronics", emoji: "⌚" },
  { name: "Fashion", emoji: "👟" },
  { name: "Home", emoji: "🏠" },
  { name: "Lifestyle", emoji: "🌿" },
];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function App() {
  const [products, setProducts] = useState([]);
const [loadingProducts, setLoadingProducts] = useState(true);
const [productError, setProductError] = useState("");

useEffect(() => {
  let cancelled = false;

  async function loadProducts() {
    try {
      setLoadingProducts(true);
      setProductError("");

      const data = await getActiveProducts();

      if (!cancelled) {
        setProducts(data);
      }
    } catch (error) {
      if (!cancelled) {
        setProductError("Products could not be loaded. Please try again.");
        console.error("Product loading failed:", error);
      }
    } finally {
      if (!cancelled) {
        setLoadingProducts(false);
      }
    }
  }

  loadProducts();

  return () => {
    cancelled = true;
  };
}, []);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Products");
  const [cart, setCart] = useState([]);
  const [notice, setNotice] = useState("");

  const filteredProducts = useMemo(() => {
  const term = search.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory =
      category === "All Products" || product.category === category;

    const matchesSearch =
      !term ||
      (product.name ?? "").toLowerCase().includes(term) ||
      (product.sku ?? "").toLowerCase().includes(term) ||
      (product.category ?? "").toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });
}, [products, search, category]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });

    setNotice(`${product.name} added to your cart`);
    window.setTimeout(() => setNotice(""), 2500);
  }

  function changeQuantity(id, amount) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  return (
    <div className="app-shell">
      <div className="announcement">
        <span className="announcement-dot" />
        YOUR EVERYDAY FINDS, ALL IN ONE PLACE
        <span className="announcement-right">CASH ON DELIVERY AVAILABLE</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="Realistic Mart home">
          <span>Realistic</span>
          <span className="brand-accent">Mart</span>
          <span className="brand-period">.</span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a className="nav-active" href="#home">
            Home
          </a>
          <a href="#products">Shop</a>
          <a href="#categories">Categories</a>
          <a href="#benefits">Why Us</a>
        </nav>

        <a className="cart-button" href="#cart">
          <span className="cart-icon">🛍</span>
          <span>Cart</span>
          <span className="cart-count">{cartCount}</span>
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              WELCOME TO REALISTIC MART
            </div>

            <h1>
              Good finds.
              <br />
              <span>Better living.</span>
            </h1>

            <p className="hero-description">
              Discover everyday essentials, trending gadgets, and little
              things that make life better. All in one place.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#products">
                Explore products <span>↗</span>
              </a>
              <span className="hero-note">Simple shopping. Happy living.</span>
            </div>

            <div className="hero-stats">
              <div>
                <strong>8+</strong>
                <span>Featured finds</span>
              </div>
              <div className="stat-divider" />
              <div>
                <strong>100%</strong>
                <span>Easy browsing</span>
              </div>
              <div className="stat-divider" />
              <div>
                <strong>COD</strong>
                <span>Pay on delivery</span>
              </div>
            </div>
          </div>

          <div className="hero-art" aria-label="Featured shopping products">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-glow" />

            <div className="floating-tag tag-top">
              <span className="tag-icon">✦</span>
              <span>
                <strong>Discover more</strong>
                <small>Your next favourite find</small>
              </span>
            </div>

            <div className="feature-product feature-watch">
              <span className="feature-emoji">⌚</span>
              <span className="feature-caption">SMART TECH</span>
            </div>

            <div className="feature-product feature-headphones">
              <span className="feature-emoji">🎧</span>
              <span className="feature-caption">DAILY ESSENTIALS</span>
            </div>

            <div className="floating-tag tag-bottom">
              <span className="tag-check">✓</span>
              <span>
                <strong>Cash on Delivery</strong>
                <small>Pay when it arrives</small>
              </span>
            </div>

            <div className="hero-index">RM / 001</div>
          </div>
        </section>

        <section className="benefit-strip" id="benefits">
          <div className="benefit-item">
            <span className="benefit-icon">↗</span>
            <span>
              <strong>Curated finds</strong>
              <small>Products worth exploring</small>
            </span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">₹</span>
            <span>
              <strong>Clear pricing</strong>
              <small>See prices before checkout</small>
            </span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">▣</span>
            <span>
              <strong>Cash on Delivery</strong>
              <small>Available at checkout soon</small>
            </span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">♡</span>
            <span>
              <strong>Made for you</strong>
              <small>Everyday shopping made simple</small>
            </span>
          </div>
        </section>

        <section className="category-section" id="categories">
          <div className="section-heading">
            <div>
              <span className="section-kicker">FIND YOUR THING</span>
              <h2>Shop by category<span>.</span></h2>
            </div>
            <p>Good things are just a few clicks away.</p>
          </div>

          <div className="category-list">
            {categories.map((item) => (
              <button
                className={`category-pill ${
                  category === item.name ? "selected" : ""
                }`}
                key={item.name}
                onClick={() => {
                  setCategory(item.name);
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span>{item.emoji}</span>
                {item.name}
                {category === item.name && (
                  <span className="category-arrow">↗</span>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading product-heading">
            <div>
              <span className="section-kicker">THE GOOD STUFF</span>
              <h2>Featured products<span>.</span></h2>
              <p className="product-subtitle">
                A few favourites to get you started.
              </p>
            </div>

            <label className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search products or SKU..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search products by name or SKU"
              />
              <kbd>/</kbd>
            </label>
          </div>

          <div className="product-toolbar">
            <span>
              Showing <strong>{filteredProducts.length}</strong> products
            </span>
            <span className="toolbar-note">
              ✦ &nbsp; Thoughtfully selected finds
            </span>
          </div>

      {loadingProducts ? (
        <p className="empty-results">Loading products...</p>
      ) : productError ? (
        <div className="empty-results">
          <p>{productError}</p>
          <button
            className="primary-button"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      ) : filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => {
                const quantity =
                  cart.find((item) => item.id === product.id)?.quantity ?? 0;

                return (
                  <article className="product-card" key={product.id}>
                    <div className={`product-image product-image-${product.id}`}>
  {product.badge && (
    <span className="product-badge">{product.badge}</span>
  )}

  {product.imageUrls?.[0] ? (
    <img
      src={product.imageUrls[0]}
      alt={product.name}
      className="product-photo"
      loading="lazy"
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  ) : (
    <span className="product-emoji" aria-hidden="true">
      🛍️
    </span>
  )}
                      <button
                        className="wishlist-button"
                        aria-label={`Save ${product.name}`}
                        onClick={(event) => {
                          event.currentTarget.classList.toggle("wishlisted");
                        }}
                      >
                        ♡
                      </button>
                      <span className="product-emoji">{product.emoji}</span>
                      <span className="product-image-index">
                        RM / {String(product.id).padStart(3, "0")}
                      </span>
                    </div>

                    <div className="product-info">
                      <span className="product-category">
                        {product.category}
                      </span>
                      <h3>{product.name}</h3>
                      <div className="product-rating">
                        {product.rating != null && (
                          <>
                            <span>★</span> {product.rating}
                            <span className="rating-divider">·</span>
                          </>
                        )}
                        <span className="sku">{product.sku || "SKU pending"}</span>
                      </div>

                      <div className="product-bottom">
                        <div className="product-price">
                          <strong>{money(product.price)}</strong>
                          <del>{money(product.oldPrice)}</del>
                        </div>
                        <button
                          className={`add-button ${quantity ? "added" : ""}`}
                          onClick={() => addToCart(product)}
                          aria-label={`Add ${product.name} to cart`}
                        >
                          {quantity ? `+ ${quantity}` : "+"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-results">
              <span>⌕</span>
              <h3>No products found</h3>
              <p>Try another product name, category, or SKU.</p>
              <button
                className="primary-button"
                onClick={() => {
                  setSearch("");
                  setCategory("All Products");
                }}
              >
                Show all products
              </button>
            </div>
          )}
        </section>

        <section className="cart-section" id="cart">
          <div className="section-heading">
            <div>
              <span className="section-kicker">YOUR PICKS</span>
              <h2>Your shopping bag<span>.</span></h2>
            </div>
            <span className="cart-summary-count">{cartCount} items</span>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <span className="empty-cart-icon">🛍</span>
              <div>
                <h3>Your bag is waiting for something good.</h3>
                <p>Add products to see them here.</p>
              </div>
              <a className="primary-button" href="#products">
                Explore products ↗
              </a>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-row" key={item.id}>
                    <span className="cart-row-emoji">{item.emoji}</span>
                    <div className="cart-row-details">
                      <strong>{item.name}</strong>
                      <small>{item.sku}</small>
                      <span>{money(item.price)} each</span>
                    </div>
                    <div className="quantity-control">
                      <button
                        onClick={() => changeQuantity(item.id, -1)}
                        aria-label={`Remove one ${item.name}`}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => changeQuantity(item.id, 1)}
                        aria-label={`Add one ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <strong className="cart-row-total">
                      {money(item.price * item.quantity)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="cart-total">
                <span>Subtotal</span>
                <strong>{money(cartTotal)}</strong>
              </div>
              <p className="checkout-note">
                Cash on Delivery only. Checkout will be connected after
                customer authentication and order storage are configured.
              </p>
              <button
                className="checkout-button"
                onClick={() =>
                  setNotice(
                    "Checkout is not connected yet. Customer login and secure order storage must be set up first.",
                  )
                }
              >
                Continue to checkout <span>↗</span>
              </button>
            </div>
          )}
        </section>

        <section className="newsletter">
          <div>
            <span className="section-kicker">A LITTLE SOMETHING EXTRA</span>
            <h2>Good finds. No fuss.</h2>
            <p>Explore everyday products picked for modern living.</p>
          </div>
          <a className="primary-button" href="#products">
            Keep exploring <span>↗</span>
          </a>
          <span className="newsletter-decoration">RM.</span>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home">
          <span>Realistic</span>
          <span className="brand-accent">Mart</span>
          <span className="brand-period">.</span>
        </a>
        <p>Everyday finds, thoughtfully brought together.</p>
        <span className="footer-copy">
          © {new Date().getFullYear()} Realistic Mart
        </span>
      </footer>

      {notice && (
        <div className="toast" role="status">
          <span>✓</span>
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}
    </div>
  );
}