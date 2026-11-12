/* ============================================================
   FRENZYY — PRODUCT CATALOG DATA
   Edit this file to add, remove, or restock products.
   To use your own photos: drop the image file into /images
   and set "img" below to match the filename exactly.
   ============================================================ */

const PRODUCTS = [
  {
    id: "frz-001",
    name: "Site Hazard Hoodie",
    category: "Hoodies",
    sku: "FRZ-H-001",
    price: 1499,
    img: "images/site-hazard-hoodie.jpg",
    desc: "Heavyweight 450GSM loopback fleece with a brutalist box-cut silhouette and structural dropped shoulders. Spray-stencil chest hit. Built for the site, worn off it.",
    details: { fabric: "450GSM loopback fleece", fit: "Oversized / dropped shoulder", care: "Cold wash / hang dry" },
    sizes: [
      { size: "S",  stock: 4 },
      { size: "M",  stock: 0 },
      { size: "L",  stock: 6 },
      { size: "XL", stock: 2 }
    ]
  },
  {
    id: "frz-002",
    name: "Rebar Cargo Pant",
    category: "Pants",
    sku: "FRZ-P-002",
    price: 1799,
    img: "images/rebar-cargo-pant.jpg",
    desc: "Water-repellent technical canvas with articulated knees and dual hardware clips. Reinforced stress points where it actually matters.",
    details: { fabric: "Water-repellent canvas", fit: "Wide / articulated knee", care: "Cold wash / no softener" },
    sizes: [
      { size: "S",  stock: 5 },
      { size: "M",  stock: 3 },
      { size: "L",  stock: 0 },
      { size: "XL", stock: 1 }
    ]
  },
  {
    id: "frz-003",
    name: "Spray Tag Tee",
    category: "Tees",
    sku: "FRZ-T-003",
    price: 699,
    img: "images/spray-tag-tee.jpg",
    desc: "Premium combed cotton jersey with a high-density hand-tag graphic across the back. Runs true to size.",
    details: { fabric: "240GSM combed cotton", fit: "Relaxed / true to size", care: "Wash inside out / cold" },
    sizes: [
      { size: "S",  stock: 8 },
      { size: "M",  stock: 6 },
      { size: "L",  stock: 4 },
      { size: "XL", stock: 0 }
    ]
  },
  {
    id: "frz-004",
    name: "Demolition Bomber",
    category: "Jackets",
    sku: "FRZ-J-004",
    price: 2499,
    img: "images/demolition-bomber.jpg",
    desc: "Padded shell with a hi-vis interior flash and riveted hardware snaps. Limited run — most sizes are already gone.",
    details: { fabric: "Padded technical shell", fit: "Cropped / structured", care: "Spot clean only" },
    sizes: [
      { size: "S",  stock: 2 },
      { size: "M",  stock: 1 },
      { size: "L",  stock: 0 },
      { size: "XL", stock: 0 }
    ]
  },
  {
    id: "frz-005",
    name: "Scaffold Cap",
    category: "Accessories",
    sku: "FRZ-A-005",
    price: 549,
    img: "images/scaffold-cap.jpg",
    desc: "Structured 6-panel with an embroidered hazard patch and adjustable strap-back. One size fits most.",
    details: { fabric: "Cotton twill", fit: "Adjustable strap-back", care: "Hand wash / air dry" },
    sizes: [
      { size: "OS", stock: 12 }
    ]
  },
  {
    id: "frz-006",
    name: "Wet Paint Crewneck",
    category: "Hoodies",
    sku: "FRZ-H-006",
    price: 1299,
    img: "images/wet-paint-crewneck.jpg",
    desc: "Mid-weight fleece crewneck with a drip-effect screen print across the front. Garment-washed for a broken-in feel from day one.",
    details: { fabric: "360GSM brushed fleece", fit: "Boxy / garment washed", care: "Cold wash / hang dry" },
    sizes: [
      { size: "S",  stock: 0 },
      { size: "M",  stock: 5 },
      { size: "L",  stock: 5 },
      { size: "XL", stock: 3 }
    ]
  }
];

/* ---------- helpers shared across pages ---------- */
function getProductById(id){
  return PRODUCTS.find(p => p.id === id) || null;
}
function totalStock(product){
  return product.sizes.reduce((sum, s) => sum + s.stock, 0);
}
function formatPrice(amount){
  return "R " + amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 });
}
function getStatusTag(product){
  const total = totalStock(product);
  if (total === 0) return { label: "SOLD OUT", cls: "out" };
  if (total <= 5)  return { label: "LOW STOCK", cls: "low" };
  return { label: "NEW", cls: "" };
}
