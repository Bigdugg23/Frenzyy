# FRENZYY — Website

A full multi-page storefront built for GitHub Pages: construction × graffiti
theme, yellow/black/white palette, working shop UI, product pages, cart with
stock-aware sizing, and stub pages for About + Contact.

## File structure

```
frenzyy/
├── index.html        Home page (hero, featured drops, manifesto, newsletter)
├── shop.html          Full catalog with category filters
├── product.html       Product detail (reads ?id= from the URL)
├── cart.html           Bag / cart with quantity controls + checkout placeholder
├── about.html          Brand story
├── contact.html        Contact form (UI only — see "Wiring things up" below)
├── css/styles.css      All styles, one shared file
├── js/data.js           Product catalog — EDIT THIS to add/remove/restock items
├── js/cart.js            Cart engine (add/remove/update, localStorage)
├── js/main.js             Page rendering + interactions
└── images/                Drop your product photos in here
```

## Adding your own photos

Each product in `js/data.js` points to a filename like:

```js
img: "images/site-hazard-hoodie.jpg"
```

Just save your photo into `/images` with that exact filename and it will
appear automatically on the home page, shop grid, product page, and cart —
no other code needs to change. Until a real photo is added, the site shows
a styled "image pending" placeholder instead of a broken image icon, so
nothing looks broken while you're shooting your lookbook.

The homepage hero uses the optimized campaign asset at
`images/hero-campaign-v2.webp`. The Studio page reuses that campaign image
alongside code-native editorial artwork, so it remains visually complete even
before a full lookbook is available.

## Editing products & stock

Open `js/data.js`. Each product looks like this:

```js
{
  id: "frz-001",
  name: "Site Hazard Hoodie",
  category: "Hoodies",
  sku: "FRZ-H-001",
  price: 1499,
  img: "images/site-hazard-hoodie.jpg",
  desc: "...",
  sizes: [
    { size: "S",  stock: 4 },
    { size: "M",  stock: 0 },
    { size: "L",  stock: 6 },
    { size: "XL", stock: 2 }
  ]
}
```

- Set `stock: 0` for a size and it automatically shows as sold out and
  becomes unselectable.
- The "NEW" / "LOW STOCK" / "SOLD OUT" badge on each product card is
  calculated automatically from total stock — you don't set it by hand.
- Add a new product by copying one of the objects and giving it a new
  unique `id`.

## Important: how the cart & stock actually work right now

This is a fully **front-end** build, which is what GitHub Pages can host.
That means:

- The cart is saved in each visitor's own browser (`localStorage`), so it
  survives page navigation and refreshes — but it's local to that one
  browser. It is **not** a shared database.
- Stock numbers in `data.js` are the same for every visitor, but when
  someone adds an item to their cart, that's only reserved *for them* —
  it doesn't reduce the count anyone else sees. Two customers could both
  "add" the last hoodie to their bags at the same time.
- There's no real payment processing yet. The checkout button on the cart
  page opens a "Checkout Coming Soon" panel that lets a customer copy their
  order summary to send you directly (WhatsApp, Instagram, email).

None of this is a bug — it's the honest ceiling of what a static site can
do on its own. It's genuinely good enough to launch with and start taking
manual orders.

## Wiring up real payments + synced stock (when you're ready)

When you want actual checkout and stock that's accurate across every
customer, you'll need *some* backend. The least-effort upgrades, roughly
in order of how much they change:

1. **Snipcart or Shopify Buy Buttons** — drop in a snippet, keep this exact
   design, get a real cart + checkout + inventory dashboard. Fastest path.
2. **Stripe Payment Links** — one link per product/size, simplest possible
   real payments, but you manage stock manually.
3. **Custom backend** — a small database (e.g. Supabase, Firebase) plus
   serverless functions for checkout. Most control, most work.

Whichever you pick, the front end here (product cards, size selector,
cart UI) is built to plug straight into it — the swap mostly happens
inside `js/cart.js` and `js/data.js`.

## Deploying to GitHub Pages

1. Push this whole `frenzyy/` folder to a GitHub repo.
2. In the repo settings, enable GitHub Pages and point it at the branch/
   folder you pushed.
3. Visit the URL GitHub gives you — `index.html` loads automatically as
   the homepage.

## Local preview

From the project folder, run:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/` in your browser.
