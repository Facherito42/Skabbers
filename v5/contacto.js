// SKABBERS — v5 · Contacto.
// No hay backend: la atención es por WhatsApp. El form arma el texto y lo manda
// precargado en el link, así el visitante solo tiene que enviarlo.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("contactNote");
  if (!form) return;

  function buildMessage(){
    const data = new FormData(form);
    const pedido = data.get("pedido") ? `\nPedido: ${data.get("pedido")}` : "";
    return `¡Hola! Soy ${data.get("nombre")}.${pedido}\n\n${data.get("mensaje")}`;
  }

  // El mensaje viaja en la URL, llega escrito y solo hay que enviarlo.
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!WA_NUMBER) return;
    window.open(waLink(buildMessage()), "_blank", "noopener");
    note.textContent = "Te abrimos WhatsApp con la consulta escrita.";
  });
});
