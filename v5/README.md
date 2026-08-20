# SKABBERS — v5

Sitio estático. Sin build: los archivos se sirven tal cual.

## Deploy

Vercel apunta a este repo con **Root Directory = `v5`**. Cualquier push a `main`
redeploya solo, en menos de un minuto.

```bash
git add . && git commit -m "descripcion del cambio" && git push
```

Rollback y previews desde el dashboard de Vercel.

## Dónde tocar cada cosa

| Qué | Dónde |
|---|---|
| Productos, precios, colores, talles | `data.js` → `PRODUCTS` |
| Qué está en oferta y con qué descuento | `data.js` → `OFFERS` |
| Instagram, URL de checkout | `layout.js` (constantes arriba de todo) |
| Nav y footer (afecta todas las páginas) | `layout.js` |
| Textos de ayuda y legales | `envios.html`, `talles.html`, `faq.html`, `privacidad.html`, `terminos.html` |

## Imágenes

Los originales viven en `../assets-src` y **no se despliegan**. Las variantes
servidas (AVIF y WebP en varios anchos, más un JPG de respaldo) se generan con:

```bash
node scripts/optimize-images.js
```

Correr eso después de agregar o reemplazar cualquier foto en `assets-src`.

Las calidades están calibradas contra PSNR: 40dB es el umbral donde la
diferencia con el original deja de percibirse, y todas quedan por encima.

### Sobre el cache

Los nombres de archivo no llevan hash de contenido, así que reemplazar una foto
no cambia su nombre. Por eso el `Cache-Control` de `/images/` usa `max-age` corto
en el navegador y `s-maxage` largo en el CDN, que Vercel purga en cada deploy:
un cambio de foto se ve en una hora, no en un año.

Si en algún momento se agrega hash a los nombres, ahí sí conviene volver a
`immutable`.

## Pendiente antes de producción

Los textos de `envios.html`, `talles.html`, `faq.html`, `privacidad.html` y
`terminos.html` son de referencia, no reales. Están marcados en cada página con
un bloque `.doc-todo`. Los plazos, medidas y condiciones legales tienen que
reemplazarse por los de la marca.
