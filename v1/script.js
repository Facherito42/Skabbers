// SKABBERS — v1 Editorial Minimalism

const PRODUCTS = [
  {
    id: "camisa-rayada",
    name: "Camisa Rayada Deshilachada",
    price: 185,
    badge: null,
    colors: [
      { name: "Negro", hex: "#1c1a17", img: "../images/products/shirt-pinstripe-black.jpg" },
      { name: "Celeste", hex: "#c3d3e0", img: "../images/products/shirt-pinstripe-blue.jpg" },
      { name: "Oliva", hex: "#767356", img: "../images/products/shirt-pinstripe-olive.jpg" }
    ]
  },
  {
    id: "hoodie-vintage",
    name: "Hoodie Skabbers Vintage",
    price: 210,
    badge: null,
    colors: [{ name: "Negro", hex: "#1c1a17", img: "../images/products/hoodie-black.jpg" }]
  },
  {
    id: "puffer-snake",
    name: "Puffer Snake",
    price: 340,
    badge: "Nuevo",
    colors: [{ name: "Negro", hex: "#1c1a17", img: "../images/products/puffer-black.jpg" }]
  },
  {
    id: "ziphoodie-corduroy",
    name: "Zip Hoodie Corduroy",
    price: 225,
    badge: "Nuevo",
    colors: [
      { name: "Sage", hex: "#a9b79f", img: "../images/products/ziphoodie-sage-main.jpg" },
      { name: "Rosa", hex: "#dba9ae", img: "../images/products/ziphoodie-pink-main.jpg" }
    ]
  },
  {
    id: "jean-ancho",
    name: "Jean Ancho Deshilachado",
    price: 195,
    badge: null,
    colors: [{ name: "Negro", hex: "#26262a", img: "../images/products/jeans-black-front.jpg" }]
  },
  {
    id: "tee-25",
    name: "Camiseta Oversized 25",
    price: 145,
    badge: "Últimas unidades",
    colors: [{ name: "Negro", hex: "#1c1a17", img: "../images/products/tee-oversized-black.jpg" }]
  }
];

function money(n){ return `$${n}`; }

function renderCard(product){
  const primary = product.colors[0];
  const swatches = product.colors.map(c =>
    `<span class="color-dot" style="background:${c.hex}" title="${c.name}" data-img="${c.img}"></span>`
  ).join("");

  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-media">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <img src="${primary.img}" alt="${product.name}, color ${primary.name}, SKABBERS" loading="lazy">
        <button class="product-quickadd" data-add="${product.id}">Agregar rápido</button>
      </div>
      <div class="product-info">
        <div>
          <p class="product-name">${product.name}</p>
          <div class="product-colors">${swatches}</div>
        </div>
        <span class="product-price">${money(product.price)}</span>
      </div>
    </article>
  `;
}

function mount(){
  const featured = document.getElementById("featuredGrid");
  const arrivals = document.getElementById("arrivalsGrid");
  if (featured) featured.innerHTML = PRODUCTS.map(renderCard).join("");
  if (arrivals) arrivals.innerHTML = [PRODUCTS[2], PRODUCTS[3], PRODUCTS[4], PRODUCTS[5]].map(renderCard).join("");

  document.querySelectorAll(".color-dot").forEach(dot => {
    dot.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      const img = card.querySelector(".product-media img");
      img.src = e.target.dataset.img;
    });
  });

  let cartCount = 0;
  const cartCountEl = document.getElementById("cartCount");
  document.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => {
      cartCount++;
      if (cartCountEl) cartCountEl.textContent = cartCount;
      btn.textContent = "Agregado";
      setTimeout(() => { btn.textContent = "Agregar rápido"; }, 1200);
    });
  });
}

function initNav(){
  const toggle = document.getElementById("menuToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

function initSearch(){
  const btn = document.getElementById("searchBtn");
  const panel = document.getElementById("searchPanel");
  const close = document.getElementById("closeSearch");
  if (!btn || !panel) return;
  btn.addEventListener("click", () => {
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) panel.querySelector("input").focus();
  });
  close?.addEventListener("click", () => panel.classList.remove("open"));
}

function initReveal(){
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !items.length) {
    items.forEach(el => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
}

function initNewsletter(){
  const form = document.getElementById("newsletterForm");
  const note = document.getElementById("newsletterNote");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    note.textContent = "Gracias. Te avisamos en el próximo lanzamiento.";
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  mount();
  initNav();
  initSearch();
  initReveal();
  initNewsletter();
});
