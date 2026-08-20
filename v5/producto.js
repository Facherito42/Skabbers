// SKABBERS — v5 · Ficha de producto. Se arma desde PRODUCTS con ?id= en la URL.

function notFoundHTML(){
  return `
    <div class="page-head">
      <h1>Prenda no encontrada</h1>
      <p class="page-lede">El link puede estar viejo o la prenda ya no está disponible.</p>
      <a class="btn btn-primary" href="tienda.html">Ver la tienda</a>
    </div>`;
}

function productHTML(product){
  const sale = salePrice(product.id);
  const offer = findOffer(product.id);
  const primary = product.colors[0];

  const swatches = product.colors.map((c, i) =>
    `<button type="button" class="swatch${i === 0 ? " is-active" : ""}" data-img="${c.img}" data-name="${c.name}" style="background:${c.hex}" aria-label="Color ${c.name}"></button>`
  ).join("");

  const sizes = product.sizes.map((s, i) =>
    `<button type="button" class="size${i === 0 ? " is-active" : ""}" data-size="${s}">${s}</button>`
  ).join("");

  const price = sale
    ? `<span class="price-was">${money(product.price)}</span> <span class="price-now">${money(sale)}</span> <span class="price-off">-${offer.off}%</span>`
    : `<span class="price-now">${money(product.price)}</span>`;

  return `
    <nav class="crumbs" aria-label="Migas de pan">
      <a href="index.html">Inicio</a><span>/</span><a href="tienda.html">Tienda</a><span>/</span><span aria-current="page">${product.name}</span>
    </nav>

    <div class="product-detail">
      <div class="detail-media" id="detailMedia">
        ${pictureHTML(primary.img, {
          alt: `${product.name}, color ${primary.name}, SKABBERS`,
          sizes: "(max-width: 860px) 100vw, 520px",
          loading: "eager"
        })}
        <span class="detail-index">${product.index}</span>
      </div>

      <div class="detail-info">
        <h1>${product.name}</h1>
        <p class="detail-price">${price}</p>
        <p class="detail-desc">${product.desc}</p>

        <div class="detail-block">
          <p class="detail-label">Color: <span id="colorName">${primary.name}</span></p>
          <div class="swatches" id="swatches">${swatches}</div>
        </div>

        <div class="detail-block">
          <p class="detail-label">Talle</p>
          <div class="sizes" id="sizes">${sizes}</div>
        </div>

        <button class="btn btn-primary btn-block" id="addBtn" data-add="${product.id}" data-size="${product.sizes[0]}">+ Agregar al carrito</button>

        <ul class="detail-specs">
          ${product.specs.map(s => `<li>${s}</li>`).join("")}
        </ul>
      </div>
    </div>

    <section class="related">
      <div class="section-head">
        <h2>También te puede gustar</h2>
        <span class="section-index">N.º 01 — 03</span>
      </div>
      <div class="product-grid" id="relatedGrid"></div>
    </section>`;
}

function mountProduct(){
  const root = document.getElementById("productRoot");
  if (!root) return;

  const id = new URLSearchParams(location.search).get("id");
  const product = findProduct(id);

  if (!product){
    root.innerHTML = notFoundHTML();
    return;
  }

  document.title = `${product.name} — SKABBERS`;
  root.innerHTML = productHTML(product);

  // Cambiar color actualiza la foto principal y la etiqueta. Con <picture> hay
  // que reemplazar el elemento: pisar img.src no gana contra el srcset.
  root.querySelector("#swatches").addEventListener("click", (e) => {
    const btn = e.target.closest(".swatch");
    if (!btn) return;
    root.querySelectorAll(".swatch").forEach(s => s.classList.remove("is-active"));
    btn.classList.add("is-active");

    root.querySelector("#detailMedia picture").outerHTML = pictureHTML(btn.dataset.img, {
      alt: `${product.name}, color ${btn.dataset.name}, SKABBERS`,
      sizes: "(max-width: 860px) 100vw, 520px",
      loading: "eager"
    });
    root.querySelector("#colorName").textContent = btn.dataset.name;
  });

  // El talle elegido viaja al carrito vía data-size del botón de agregar.
  root.querySelector("#sizes").addEventListener("click", (e) => {
    const btn = e.target.closest(".size");
    if (!btn) return;
    root.querySelectorAll(".size").forEach(s => s.classList.remove("is-active"));
    btn.classList.add("is-active");
    root.querySelector("#addBtn").dataset.size = btn.dataset.size;
  });

  const related = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);
  root.querySelector("#relatedGrid").innerHTML = related.map(renderCard).join("");
  initColorSwatches(root.querySelector("#relatedGrid"));
}

document.addEventListener("DOMContentLoaded", mountProduct);
