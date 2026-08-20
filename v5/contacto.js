// SKABBERS — v5 · Contacto.
// No hay backend: la atención es por mensajería. El form arma el texto y lo
// manda al canal elegido — WhatsApp lo recibe escrito, Instagram por copiado.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("contactNote");
  if (!form) return;

  function buildMessage(){
    const data = new FormData(form);
    const pedido = data.get("pedido") ? `\nPedido: ${data.get("pedido")}` : "";
    return `¡Hola! Soy ${data.get("nombre")}.${pedido}\n\n${data.get("mensaje")}`;
  }

  // WhatsApp: el mensaje viaja en la URL, llega escrito y solo hay que enviarlo.
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!WA_NUMBER) return;
    window.open(waLink(buildMessage()), "_blank", "noopener");
    note.textContent = "Te abrimos WhatsApp con la consulta escrita.";
  });

  // Instagram: no admite precargar texto, así que se copia y se pega.
  document.getElementById("contactIg")?.addEventListener("click", () => {
    if (!form.reportValidity()) return;
    copyThenOpen(buildMessage(), IG_DM).then(copied => {
      note.textContent = copied
        ? "Consulta copiada. Pegala en el mensaje directo."
        : "Copiá tu consulta del formulario y pegala en el chat.";
    });
  });
});
