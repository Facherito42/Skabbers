// SKABBERS — v5 · Chrome compartido: nav, footer y carrito.
// Se inyecta en todas las páginas para no duplicar el markup y que los links
// no se desincronicen entre archivos.

const IG_USER = "skabbers_clo";

// Solo dígitos, con código de país y sin el "+": es lo que exige wa.me.
const WA_NUMBER = "59891865906";

const SOCIAL = {
  instagram: `https://www.instagram.com/${IG_USER}/`
};

// ig.me/m abre la conversación directamente, en vez del perfil: el cliente no
// tiene que buscar el botón "Mensaje". Es el formato oficial de Meta.
// Instagram no admite precargar el texto del mensaje (el único parámetro que
// acepta es ?ref=, que solo sirve para tracking), así que el pedido se copia al
// portapapeles y el cliente lo pega.
// WhatsApp admite precargar el mensaje en la URL: el cliente abre el chat con el
// pedido escrito y solo envía. Instagram no lo permite, por eso no se usa acá.
function waLink(text){
  return WA_NUMBER ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}` : "";
}
// Si algún día hay checkout propio, poner la URL acá y reemplaza al de Instagram.
const CHECKOUT_URL = "";

const NAV_ITEMS = [
  { label: "Tienda", href: "tienda.html" },
  { label: "Nueva colección", href: "index.html#catalogo" },
  { label: "Nosotros", href: "nosotros.html" }
];

const isHome = () => /(^|\/)(index\.html)?$/.test(location.pathname.split("/").pop() || "index.html");

// Desde el home los anchors quedan como hash puro para no recargar la página.
function resolveHref(href){
  if (isHome() && href.startsWith("index.html#")) return href.slice("index.html".length);
  return href;
}

function socialLink(url, label, icon){
  if (!url) return "";
  return `<a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${label}"><i class="ph-light ${icon}"></i></a>`;
}

function navHTML(){
  const links = NAV_ITEMS
    .map(i => `<a href="${resolveHref(i.href)}">${i.label}</a>`)
    .join("");

  return `
  <div class="nav-inner">
    <a href="index.html" class="logo">SKABBERS</a>
    <nav class="nav-links" id="navLinks" aria-label="Navegación principal">${links}</nav>
    <div class="nav-actions">
      <button class="icon-btn" aria-label="Buscar" id="searchBtn"><i class="ph-light ph-magnifying-glass"></i></button>
      <button class="icon-btn cart-btn" aria-label="Abrir carrito" id="cartBtn"><i class="ph-light ph-shopping-bag"></i><span class="cart-count" id="cartCount">0</span></button>
      <button class="menu-toggle" id="menuToggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="navLinks">
        <span></span><span></span>
      </button>
    </div>
  </div>
  <div class="search-panel" id="searchPanel">
    <div class="search-panel-inner">
      <i class="ph-light ph-magnifying-glass"></i>
      <input type="search" placeholder="BUSCAR PRENDAS" aria-label="Buscar prendas" id="searchInput">
      <button class="icon-btn" aria-label="Cerrar búsqueda" id="closeSearch"><i class="ph-light ph-x"></i></button>
    </div>
  </div>`;
}

function footerHTML(){
  return `
  <div class="footer-top">
    <div class="footer-brand">
      <a href="index.html" class="logo">SKABBERS</a>
      <p>Piezas oversized diseñadas con precisión.</p>
      <div class="social-links">
        ${socialLink(SOCIAL.instagram, "Instagram", "ph-instagram-logo")}
        ${socialLink(WA_NUMBER ? `https://wa.me/${WA_NUMBER}` : "", "WhatsApp", "ph-whatsapp-logo")}
      </div>
    </div>
    <nav class="footer-col" aria-label="Tienda">
      <h3>Tienda</h3>
      <a href="tienda.html">Ver todo</a>
      <a href="tienda.html?ofertas=1">Ofertas</a>
      <a href="${resolveHref("index.html#catalogo")}">Nueva colección</a>
      <a href="nosotros.html">Nosotros</a>
    </nav>
    <nav class="footer-col" aria-label="Ayuda">
      <h3>Ayuda</h3>
      <a href="envios.html">Envíos y devoluciones</a>
      <a href="talles.html">Guía de talles</a>
      <a href="contacto.html">Contacto</a>
      <a href="faq.html">Preguntas frecuentes</a>
    </nav>
    <div class="footer-col footer-newsletter">
      <h3>Novedades</h3>
      <p>Lanzamientos y ediciones limitadas.</p>
      <form class="newsletter-form" id="newsletterForm">
        <label for="newsletterEmail" class="sr-only">Correo electrónico</label>
        <input type="email" id="newsletterEmail" placeholder="TU CORREO" required>
        <button type="submit" aria-label="Suscribirse"><i class="ph-light ph-arrow-right"></i></button>
      </form>
      <p class="form-note" id="newsletterNote" role="status"></p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2026 SKABBERS</p>
    <span class="footer-meta">DESDE 2026</span>
    <div class="footer-legal">
      <a href="privacidad.html">Privacidad</a>
      <a href="terminos.html">Términos</a>
    </div>
  </div>`;
}

function drawerHTML(){
  return `
  <div class="drawer-backdrop" id="cartBackdrop"></div>
  <aside class="drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Carrito" aria-hidden="true">
    <div class="drawer-head">
      <h2>Carrito <span class="drawer-count" id="drawerCount">0</span></h2>
      <button class="icon-btn" id="cartClose" aria-label="Cerrar carrito"><i class="ph-light ph-x"></i></button>
    </div>
    <div class="drawer-body" id="cartBody"></div>
    <div class="drawer-foot" id="cartFoot"></div>
  </aside>`;
}

/* ---------------- Carrito ---------------- */

const CART_KEY = "skabbers-cart";

function readCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function writeCart(items){
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  renderCart();
}

function cartAdd(id, size){
  const items = readCart();
  const line = items.find(i => i.id === id && i.size === size);
  if (line) line.qty++;
  else items.push({ id, size: size || null, qty: 1 });
  writeCart(items);
}

function cartSetQty(index, qty){
  const items = readCart();
  if (!items[index]) return;
  if (qty <= 0) items.splice(index, 1);
  else items[index].qty = qty;
  writeCart(items);
}

function cartSetSize(index, size){
  const items = readCart();
  const line = items[index];
  if (!line) return;
  line.size = size;

  // Si el nuevo talle coincide con otra línea del mismo producto, se fusionan
  // en vez de quedar duplicadas.
  const twin = items.findIndex((l, i) => i !== index && l.id === line.id && l.size === size);
  if (twin > -1){
    items[twin].qty += line.qty;
    items.splice(index, 1);
  }
  writeCart(items);
}

function cartTotals(){
  return readCart().reduce((acc, line) => {
    const product = findProduct(line.id);
    if (!product) return acc;
    const unit = salePrice(line.id) ?? product.price;
    acc.qty += line.qty;
    acc.subtotal += unit * line.qty;
    return acc;
  }, { qty: 0, subtotal: 0 });
}

// Poder corregir el talle sin volver a la ficha: es el error mas comun al
// armar un pedido. Las lineas viejas guardadas sin talle muestran un aviso.
function sizePickerHTML(product, line, index){
  if (!product.sizes?.length) return "";
  const opts = product.sizes.map(s =>
    `<option value="${s}"${s === line.size ? " selected" : ""}>Talle ${s}</option>`
  ).join("");
  const sinTalle = line.size ? "" : `<option value="" selected disabled>Elegí talle</option>`;

  return `
    <label class="sr-only" for="cartSize${index}">Talle de ${product.name}</label>
    <select class="cart-size" id="cartSize${index}" data-size-for="${index}">${sinTalle}${opts}</select>`;
}

function cartLineHTML(line, index){
  const product = findProduct(line.id);
  if (!product) return "";
  const sale = salePrice(line.id);
  const unit = sale ?? product.price;
  return `
    <article class="cart-line">
      <a class="cart-thumb" href="producto.html?id=${product.id}">
        ${pictureHTML(product.colors[0].img, { alt: product.name, sizes: "72px" })}
      </a>
      <div class="cart-line-info">
        <a class="cart-line-name" href="producto.html?id=${product.id}">${product.name}</a>
        ${sizePickerHTML(product, line, index)}
        <p class="cart-line-price">
          ${sale ? `<span class="cart-was">${money(product.price)}</span>` : ""}
          <span>${money(unit)}</span>
        </p>
        <div class="qty">
          <button type="button" data-qty="${index}" data-delta="-1" aria-label="Quitar uno">−</button>
          <span>${line.qty}</span>
          <button type="button" data-qty="${index}" data-delta="1" aria-label="Agregar uno">+</button>
          <button type="button" class="qty-remove" data-remove="${index}">Eliminar</button>
        </div>
      </div>
    </article>`;
}

function renderCart(){
  const items = readCart();
  const totals = cartTotals();

  document.querySelectorAll("#cartCount").forEach(el => {
    el.textContent = totals.qty;
    el.classList.toggle("is-empty", totals.qty === 0);
  });
  const drawerCount = document.getElementById("drawerCount");
  if (drawerCount) drawerCount.textContent = totals.qty;

  const body = document.getElementById("cartBody");
  const foot = document.getElementById("cartFoot");
  if (!body || !foot) return;

  if (!items.length){
    body.innerHTML = `<p class="cart-empty">Todavía no agregaste nada.</p>`;
    foot.innerHTML = `<a class="btn btn-ghost btn-block" href="tienda.html">Ver la tienda</a>`;
    return;
  }

  body.innerHTML = items.map(cartLineHTML).join("");

  let action, note;
  if (CHECKOUT_URL){
    note = "Envío e impuestos se calculan en el checkout.";
    action = `<a class="btn btn-primary btn-block" href="${CHECKOUT_URL}">Finalizar compra</a>`;
  } else if (WA_NUMBER){
    note = "Te abrimos el chat con el pedido escrito: solo tenés que enviarlo.";
    // Va como <a>: el mensaje viaja en la URL, no necesita portapapeles ni
    // window.open, así que ningún bloqueador de popups lo puede frenar.
    action = `<a class="btn btn-whatsapp btn-block" href="${waLink(orderSummary())}" target="_blank" rel="noopener"><i class="ph-light ph-whatsapp-logo"></i>Pedir por WhatsApp</a>`;
  } else {
    note = "Envío e impuestos se calculan en el checkout.";
    action = `<button class="btn btn-primary btn-block" id="checkoutBtn" disabled>Checkout pendiente de conectar</button>`;
  }

  foot.innerHTML = `
    <div class="cart-subtotal">
      <span>Subtotal</span>
      <span>${money(totals.subtotal)}</span>
    </div>
    <p class="cart-note">${note}</p>
    ${action}`;
}

// La compra se cierra por DM: el cliente llega a Instagram con el pedido listo
// para pegar, en vez de tener que reescribirlo de memoria.
function orderSummary(){
  const totals = cartTotals();
  const lines = readCart().map(line => {
    const product = findProduct(line.id);
    if (!product) return "";
    const unit = salePrice(line.id) ?? product.price;
    const size = line.size ? ` (talle ${line.size})` : "";
    return `· ${product.name}${size} x${line.qty} — ${money(unit * line.qty)}`;
  }).filter(Boolean);

  return `¡Hola! Quiero hacer este pedido:\n${lines.join("\n")}\n\nTotal: ${money(totals.subtotal)}`;
}

function openCart(){
  document.getElementById("cartDrawer")?.classList.add("open");
  document.getElementById("cartDrawer")?.setAttribute("aria-hidden", "false");
  document.getElementById("cartBackdrop")?.classList.add("open");
  document.body.classList.add("no-scroll");
  document.getElementById("cartClose")?.focus();
}

function closeCart(){
  document.getElementById("cartDrawer")?.classList.remove("open");
  document.getElementById("cartDrawer")?.setAttribute("aria-hidden", "true");
  document.getElementById("cartBackdrop")?.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

function initCart(){
  renderCart();

  // Al volver con el botón atrás el navegador puede restaurar la página desde su
  // caché sin re-ejecutar los scripts: el contador quedaría con el valor previo
  // a lo que se agregó, y parece que el carrito se vació.
  window.addEventListener("pageshow", (e) => { if (e.persisted) renderCart(); });

  // El carrito es compartido: si se toca en otra pestaña, esta se actualiza.
  window.addEventListener("storage", (e) => { if (e.key === CART_KEY) renderCart(); });

  document.getElementById("cartBtn")?.addEventListener("click", openCart);
  document.getElementById("cartClose")?.addEventListener("click", closeCart);
  document.getElementById("cartBackdrop")?.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

  document.getElementById("cartBody")?.addEventListener("click", (e) => {
    const qtyBtn = e.target.closest("[data-qty]");
    if (qtyBtn){
      const i = Number(qtyBtn.dataset.qty);
      cartSetQty(i, readCart()[i].qty + Number(qtyBtn.dataset.delta));
      return;
    }
    const rm = e.target.closest("[data-remove]");
    if (rm) cartSetQty(Number(rm.dataset.remove), 0);
  });

  document.getElementById("cartBody")?.addEventListener("change", (e) => {
    const sel = e.target.closest("[data-size-for]");
    if (sel) cartSetSize(Number(sel.dataset.sizeFor), sel.value);
  });

  // Cualquier botón [data-add="id"] de cualquier página suma al carrito.
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    cartAdd(btn.dataset.add, btn.dataset.size || null);
    const original = btn.dataset.label || btn.textContent;
    btn.dataset.label = original;
    btn.textContent = "Agregado";
    setTimeout(() => { btn.textContent = original; }, 1200);
  });
}

/* ---------------- Nav ---------------- */

function initNav(){
  const toggle = document.getElementById("menuToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links){
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  // Marca el item de nav que corresponde a la página actual.
  const here = location.pathname.split("/").pop() || "index.html";
  links?.querySelectorAll("a").forEach(a => {
    if (a.getAttribute("href").split("#")[0] === here) a.setAttribute("aria-current", "page");
  });
}

function initSearch(){
  const btn = document.getElementById("searchBtn");
  const panel = document.getElementById("searchPanel");
  const close = document.getElementById("closeSearch");
  const input = document.getElementById("searchInput");
  if (!btn || !panel) return;

  btn.addEventListener("click", () => {
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) input?.focus();
  });
  close?.addEventListener("click", () => panel.classList.remove("open"));

  // Buscar lleva a la tienda con el término aplicado.
  input?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const q = input.value.trim();
    if (q) location.href = `tienda.html?q=${encodeURIComponent(q)}`;
  });
}

function initNewsletter(){
  const form = document.getElementById("newsletterForm");
  const note = document.getElementById("newsletterNote");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    note.textContent = "Listo. Te avisamos en el próximo lanzamiento.";
    form.reset();
  });
}

function initChrome(){
  const header = document.getElementById("siteNav");
  const footer = document.getElementById("siteFooter");
  if (header) header.innerHTML = navHTML();
  if (footer) footer.innerHTML = footerHTML();
  document.body.insertAdjacentHTML("beforeend", drawerHTML());

  initNav();
  initSearch();
  initNewsletter();
  initCart();
}

document.addEventListener("DOMContentLoaded", initChrome);
