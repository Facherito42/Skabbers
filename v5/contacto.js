// SKABBERS — v5 · Contacto.
// No hay backend ni casilla de correo: la atención es por DM. El form arma el
// mensaje, lo copia al portapapeles y abre Instagram, igual que el checkout.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("contactNote");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const pedido = data.get("pedido") ? `\nPedido: ${data.get("pedido")}` : "";
    const mensaje = `¡Hola! Soy ${data.get("nombre")}.${pedido}\n\n${data.get("mensaje")}`;

    // Abrir primero: después de un await se pierde la activación de usuario y el
    // navegador bloquea la ventana como popup.
    window.open(SOCIAL.instagram, "_blank", "noopener");

    try {
      await navigator.clipboard.writeText(mensaje);
      note.textContent = "Consulta copiada. Pegala en el mensaje directo.";
    } catch {
      note.textContent = "Abrimos Instagram. Copiá tu consulta y pegala en el chat.";
    }
  });
});
