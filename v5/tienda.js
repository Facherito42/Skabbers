// SKABBERS — v5 · Tienda. Filtra por ?ofertas=1 y por ?q= (búsqueda del nav).

function shopParams(){
  const p = new URLSearchParams(location.search);
  return { onlyOffers: p.get("ofertas") === "1", query: (p.get("q") || "").trim().toLowerCase() };
}

function filterProducts({ onlyOffers, query }){
  return PRODUCTS.filter(product => {
    if (onlyOffers && !findOffer(product.id)) return false;
    if (!query) return true;
    const haystack = `${product.name} ${product.desc} ${product.colors.map(c => c.name).join(" ")}`.toLowerCase();
    return haystack.includes(query);
  });
}

function mountShop(){
  const grid = document.getElementById("shopGrid");
  if (!grid) return;

  const params = shopParams();
  const list = filterProducts(params);

  const title = document.getElementById("shopTitle");
  const lede = document.getElementById("shopLede");
  if (params.query){
    title.textContent = "Resultados";
    lede.textContent = `Prendas que coinciden con "${params.query}".`;
  } else if (params.onlyOffers){
    title.textContent = "Ofertas";
    lede.textContent = "Prendas con descuento por tiempo limitado.";
  }

  document.getElementById("shopCount").textContent =
    `${list.length} ${list.length === 1 ? "prenda" : "prendas"}`;

  grid.innerHTML = list.map(renderCard).join("");
  initColorSwatches(grid);

  document.getElementById("shopEmpty").hidden = list.length > 0;

  // Marca el chip activo según el filtro en la URL.
  const activeHref = params.onlyOffers ? "tienda.html?ofertas=1" : "tienda.html";
  document.querySelectorAll("#shopFilters .chip").forEach(chip => {
    chip.classList.toggle("is-active", !params.query && chip.getAttribute("href") === activeHref);
  });
}

document.addEventListener("DOMContentLoaded", mountShop);
