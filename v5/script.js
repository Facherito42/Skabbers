// SKABBERS — v5 · Home. Nav, footer y carrito viven en layout.js; el catálogo en data.js.

function offerCard(offer){
  const product = findProduct(offer.id);
  const sale = salePrice(offer.id);
  return `
    <article class="offer-card">
      <a class="offer-link" href="producto.html?id=${product.id}" aria-label="Ver ${product.name}">
        <div class="offer-media">
          ${pictureHTML(product.colors[0].img, { sizes: "150px" })}
          <span class="offer-off">-${offer.off}%</span>
        </div>
        <div class="offer-info">
          <p class="offer-name">${product.name}</p>
          <p class="offer-prices">
            <span class="offer-was">${money(product.price)}</span>
            <span class="offer-now">${money(sale)}</span>
          </p>
        </div>
      </a>
    </article>
  `;
}

// El translate -50% se calcula sobre el ancho del propio track, así que si el
// contenido cambia con la animación corriendo la posición salta. Por eso solo se
// rellena cuando la mitad dejó de cubrir el viewport; si ya alcanza, no se toca.
function fillHalves(track, unit, minWidth){
  const current = track.firstElementChild;
  if (current && current.getBoundingClientRect().width >= minWidth) return;

  const half = document.createElement("div");
  half.className = "offers-set";
  track.innerHTML = "";
  track.appendChild(half);

  let guard = 0;
  do {
    half.insertAdjacentHTML("beforeend", unit);
    guard++;
  } while (half.getBoundingClientRect().width < minWidth && guard < 300);

  // La segunda mitad es solo relleno visual: no debe duplicar links ni tab stops.
  const clone = half.cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  clone.querySelectorAll("a").forEach(a => a.setAttribute("tabindex", "-1"));
  track.appendChild(clone);
}

function initOffers(){
  const strip = document.getElementById("offersStrip");
  const ticker = document.getElementById("offersTicker");
  if (!strip || !ticker) return;

  const tiles = OFFERS.map(offerCard).join("");
  const word = `<span class="offers-word">Ofertas</span><span class="offers-sep">|</span>`;

  // Un margen extra sobre el viewport evita tener que rellenar de nuevo ante
  // cambios chicos (métricas de la webfont, resize, barra de scroll).
  const target = () => window.innerWidth * 1.35;

  const build = () => {
    fillHalves(strip, tiles, target());
    fillHalves(ticker, word, target());
  };

  build();
  // La tipografía llega por webfont y cambia el ancho del texto: hay que re-chequear.
  document.fonts?.ready.then(build);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });
}

function mountGrids(){
  const featured = document.getElementById("featuredGrid");
  const arrivals = document.getElementById("arrivalsGrid");
  if (featured) featured.innerHTML = PRODUCTS.map(renderCard).join("");
  if (arrivals) arrivals.innerHTML = [PRODUCTS[2], PRODUCTS[3], PRODUCTS[4], PRODUCTS[5]].map(renderCard).join("");
  initColorSwatches();
}

document.addEventListener("DOMContentLoaded", () => {
  mountGrids();
  initOffers();
});
