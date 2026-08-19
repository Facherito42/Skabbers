// SKABBERS — v5 · Contacto.
// No hay backend: si hay CONTACT_EMAIL cargado el form arma un mailto, y si no
// avisa que el canal todavía no está conectado en vez de fingir que se envió.

document.addEventListener("DOMContentLoaded", () => {
  if (CONTACT_EMAIL){
    const channel = document.getElementById("mailChannel");
    const link = document.getElementById("mailLink");
    if (channel && link){
      channel.hidden = false;
      link.href = `mailto:${CONTACT_EMAIL}`;
      link.textContent = CONTACT_EMAIL;
    }
  }

  const form = document.getElementById("contactForm");
  const note = document.getElementById("contactNote");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!CONTACT_EMAIL){
      note.textContent = "El formulario todavía no está conectado. Escribinos por Instagram mientras tanto.";
      return;
    }

    const data = new FormData(form);
    const asunto = data.get("pedido")
      ? `Consulta pedido ${data.get("pedido")}`
      : "Consulta desde la web";
    const cuerpo = `${data.get("mensaje")}\n\n—\n${data.get("nombre")}\n${data.get("email")}`;

    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    note.textContent = "Abrimos tu cliente de correo con la consulta cargada.";
  });
});
