// SKABBERS — v5 · Catálogo y datos compartidos por todas las páginas.

const PRODUCTS = [
  {
    id: "camisa-rayada", index: "01",
    name: "Camisa Rayada Deshilachada",
    price: 185,
    badge: null,
    desc: "Camisa oversized de corte recto y hombro caído, en tela rayada con bajo deshilachado a mano.",
    specs: ["Corte oversized", "Hombro caído", "Bajo deshilachado", "100% algodón"],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Negro", hex: "#1c1a17", img: "images/products/shirt-pinstripe-black" },
      { name: "Celeste", hex: "#c3d3e0", img: "images/products/shirt-pinstripe-blue" },
      { name: "Oliva", hex: "#767356", img: "images/products/shirt-pinstripe-olive" }
    ]
  },
  {
    id: "hoodie-vintage", index: "02",
    name: "Hoodie Skabbers Vintage",
    price: 210,
    badge: null,
    desc: "Buzo con capucha en algodón pesado con lavado vintage y logo Skabbers bordado al frente.",
    specs: ["Algodón pesado 420g", "Lavado vintage", "Logo bordado", "Puños acanalados"],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Negro", hex: "#1c1a17", img: "images/products/hoodie-black" }]
  },
  {
    id: "puffer-snake", index: "03",
    name: "Puffer Snake",
    price: 340,
    badge: "Nuevo",
    desc: "Campera puffer de volumen amplio con cuello alto y bordado snake en tono sobre tono.",
    specs: ["Relleno térmico", "Cuello alto", "Bordado tono sobre tono", "Cierre metálico"],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Negro", hex: "#1c1a17", img: "images/products/puffer-black" }]
  },
  {
    id: "ziphoodie-corduroy", index: "04",
    name: "Zip Hoodie Corduroy",
    price: 225,
    badge: "Nuevo",
    desc: "Campera con capucha y cierre completo en corderoy de morley fino, con caída estructurada.",
    specs: ["Corderoy fino", "Cierre completo", "Caída estructurada", "Bolsillos laterales"],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Sage", hex: "#a9b79f", img: "images/products/ziphoodie-sage-main" },
      { name: "Rosa", hex: "#dba9ae", img: "images/products/ziphoodie-pink-main" }
    ]
  },
  {
    id: "jean-ancho", index: "05",
    name: "Jean Ancho Deshilachado",
    price: 195,
    badge: null,
    desc: "Denim de pierna ancha con lavado profundo, roturas trabajadas y bajo deshilachado.",
    specs: ["Pierna ancha", "Denim 14oz", "Roturas trabajadas", "Tiro alto"],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [{ name: "Negro", hex: "#26262a", img: "images/products/jeans-black-front" }]
  },
  {
    id: "tee-25", index: "06",
    name: "Camiseta Oversized 25",
    price: 145,
    badge: "Últimas",
    desc: "Remera oversized de jersey pesado con caída recta y estampa Skabbers 25 en el frente.",
    specs: ["Jersey pesado 240g", "Caída recta", "Cuello reforzado", "100% algodón"],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Negro", hex: "#1c1a17", img: "images/products/tee-oversized-black" }]
  }
];

// Prendas en oferta y su descuento. Editar acá cambia el slider del home y la tienda.
const OFFERS = [
  { id: "camisa-rayada", off: 30 },
  { id: "hoodie-vintage", off: 25 },
  { id: "ziphoodie-corduroy", off: 20 },
  { id: "jean-ancho", off: 20 },
  { id: "tee-25", off: 35 }
];

// Anchos generados por scripts/optimize-images.js para las fotos de producto.
const PRODUCT_WIDTHS = [480, 640, 960];

// Ancho que ocupa una card segun el breakpoint, para que el navegador no baje
// una foto de 960px cuando la va a mostrar a 240.
const CARD_SIZES = "(max-width: 480px) 100vw, (max-width: 1080px) 50vw, 33vw";

// <picture> con AVIF y WebP por ancho, mas un unico JPG de respaldo. El <img>
// sigue recibiendo los estilos de siempre; el <picture> solo negocia formato.
function pictureHTML(base, opts){
  const o = opts || {};
  const widths = o.widths || PRODUCT_WIDTHS;
  const sizes = o.sizes || "100vw";
  const srcset = ext => widths.map(w => `${base}-${w}.${ext} ${w}w`).join(", ");

  return `<picture>
      <source type="image/avif" srcset="${srcset("avif")}" sizes="${sizes}">
      <source type="image/webp" srcset="${srcset("webp")}" sizes="${sizes}">
      <img src="${base}-fallback.jpg" alt="${o.alt || ""}" loading="${o.loading || "lazy"}" decoding="async">
    </picture>`;
}

function money(n){ return `$${n}`; }

function findProduct(id){ return PRODUCTS.find(p => p.id === id) || null; }

function findOffer(id){ return OFFERS.find(o => o.id === id) || null; }

// Precio final si la prenda está en oferta; si no, null.
function salePrice(id){
  const offer = findOffer(id);
  const product = findProduct(id);
  if (!offer || !product) return null;
  return Math.round(product.price * (1 - offer.off / 100));
}

// Card de producto usada en el home y en la tienda. La media no puede ser un <a>
// porque adentro va el botón de agregar, así que el link se estira por encima.
function renderCard(product){
  const primary = product.colors[0];
  const offer = findOffer(product.id);
  const sale = salePrice(product.id);
  const url = `producto.html?id=${product.id}`;

  const swatches = product.colors.map(c =>
    `<span class="color-dot" style="background:${c.hex}" title="${c.name}" data-img="${c.img}"></span>`
  ).join("");

  const badge = offer
    ? `<span class="product-badge">-${offer.off}%</span>`
    : product.badge ? `<span class="product-badge">${product.badge}</span>` : "";

  const price = sale
    ? `<span class="product-price"><span class="price-was">${money(product.price)}</span> ${money(sale)}</span>`
    : `<span class="product-price">${money(product.price)}</span>`;

  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-media">
        ${badge}
        <span class="product-index">${product.index}</span>
        ${pictureHTML(primary.img, { alt: `${product.name}, color ${primary.name}, SKABBERS`, sizes: CARD_SIZES })}
        <a class="product-link" href="${url}" aria-label="Ver ${product.name}"></a>
        <a class="product-quickadd" href="${url}" tabindex="-1">Elegir talle</a>
      </div>
      <div class="product-info">
        <a class="product-name" href="${url}">${product.name}</a>
        <div class="product-row">
          <div class="product-colors">${swatches}</div>
          ${price}
        </div>
      </div>
    </article>
  `;
}

// Los swatches cambian la foto de la card sin salir de la grilla. Con <picture>
// no alcanza con pisar img.src: el srcset del <source> gana, hay que reemplazar
// el elemento entero.
function initColorSwatches(root){
  (root || document).querySelectorAll(".color-dot").forEach(dot => {
    dot.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      const picture = card.querySelector(".product-media picture");
      const alt = picture.querySelector("img").alt;
      picture.outerHTML = pictureHTML(e.target.dataset.img, { alt, sizes: CARD_SIZES });
    });
  });
}
