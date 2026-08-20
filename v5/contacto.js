// SKABBERS — v5 · Contacto.
// No hay backend ni casilla de correo: la atención es por DM. El form arma el
// mensaje, lo copia al portapapeles y abre Instagram, igual que el checkout.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("contactNote");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const pedido = data.get("pedido") ? `\nPedido: ${data.get("pedido")}` : "";
    const mensaje = `¡Hola! Soy ${data.get("nombre")}.${pedido}\n\n${data.get("mensaje")}`;

    // copyThenOpen dispara la copia antes de abrir la pestaña: abrirla primero
    // le saca el foco al documento y el portapapeles deja de funcionar.
    copyThenOpen(mensaje, IG_DM).then(copied => {
      note.textContent = copied
        ? "Consulta copiada. Pegala en el mensaje directo."
        : "Copiá tu consulta del formulario y pegala en el chat.";
    });
  });
});
