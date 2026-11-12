/* ============================================================
   FRENZYY — CART ENGINE
   Cart persists in the browser via localStorage so it survives
   navigation between pages. This is local-only: stock counts and
   cart contents are NOT shared across different customers/devices.
   When you're ready to wire up real payments + synced inventory,
   swap this for Snipcart, Shopify, or a custom backend — the rest
   of the front end (product cards, size selector, cart UI) will
   plug straight into it. See README.md for more on this.
   ============================================================ */

const CART_KEY = "frenzyy_cart_v1";

function getCart(){
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart){
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) { /* storage unavailable — fails silently, cart just won't persist */ }
  updateCartBadge();
}

function findSizeStock(productId, size){
  const product = getProductById(productId);
  if (!product) return 0;
  const s = product.sizes.find(s => s.size === size);
  return s ? s.stock : 0;
}

function getCartLineQty(productId, size){
  const item = getCart().find(i => i.productId === productId && i.size === size);
  return item ? item.qty : 0;
}

/** Adds qty to cart, clamped so it never exceeds available stock. Returns final qty in cart for that line. */
function addToCart(productId, size, qty){
  const cart = getCart();
  const stock = findSizeStock(productId, size);
  const existing = cart.find(i => i.productId === productId && i.size === size);
  const currentQty = existing ? existing.qty : 0;
  const finalQty = Math.max(0, Math.min(currentQty + qty, stock));

  if (existing) {
    existing.qty = finalQty;
  } else if (finalQty > 0) {
    cart.push({ productId, size, qty: finalQty });
  }
  saveCart(cart);
  return finalQty;
}

/** Sets an exact quantity for a line (used by +/- steppers in the cart page). */
function setCartLineQty(productId, size, qty){
  let cart = getCart();
  const stock = findSizeStock(productId, size);
  const clamped = Math.max(0, Math.min(qty, stock));

  if (clamped === 0) {
    cart = cart.filter(i => !(i.productId === productId && i.size === size));
  } else {
    const item = cart.find(i => i.productId === productId && i.size === size);
    if (item) item.qty = clamped;
  }
  saveCart(cart);
  return clamped;
}

function removeFromCart(productId, size){
  const cart = getCart().filter(i => !(i.productId === productId && i.size === size));
  saveCart(cart);
}

function clearCart(){
  saveCart([]);
}

function getCartCount(){
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function getCartLines(){
  return getCart().map(item => {
    const product = getProductById(item.productId);
    return {
      ...item,
      product,
      lineTotal: product ? product.price * item.qty : 0
    };
  }).filter(line => line.product);
}

function getCartTotal(){
  return getCartLines().reduce((sum, line) => sum + line.lineTotal, 0);
}

function updateCartBadge(){
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = getCartCount();
  });
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
