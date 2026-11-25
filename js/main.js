/**
 * main.js — Formulario de contacto + modal <dialog> (Módulos 13, 17 y 21)
 *
 * Flujo:
 *   1. El navegador valida el formulario con los atributos HTML
 *      (required, type="email", pattern, minlength). Si algo falla,
 *      el evento "submit" NUNCA se dispara: el navegador muestra el error.
 *   2. Si es válido, mostramos un resumen en un <dialog> modal.
 *
 * Nota: en modo demo no se envían datos. Para enviarlos de verdad,
 * configura el action del formulario (ver README) y pon DEMO_MODE = false.
 */
const DEMO_MODE = true;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const dialog = document.getElementById("confirm-dialog");

  if (!form || !dialog) {
    console.error("[main] Falta #contact-form o #confirm-dialog en el HTML.");
    return;
  }

  // Comprobación de soporte (todos los navegadores modernos soportan <dialog>)
  if (typeof dialog.showModal !== "function") {
    console.warn("[main] Este navegador no soporta <dialog>. Se usará el envío normal.");
    return;
  }

  const labels = {
    respuesta: { email: "correo", telefono: "teléfono" },
    motivo: {
      proyecto: "propuesta de proyecto",
      practicas: "oportunidad de prácticas o empleo",
      colaboracion: "colaboración académica",
      otro: "otro motivo",
    },
  };

  form.addEventListener("submit", (event) => {
    // Llegar aquí significa que la validación nativa ya pasó
    if (!DEMO_MODE) return; // envío real al action del formulario

    event.preventDefault();

    const data = new FormData(form);

    // textContent (no innerHTML): el texto del usuario nunca se interpreta como HTML,
    // así se evita inyectar código (XSS).
    setField(dialog, "nombre", data.get("nombre")?.trim() || "visitante");
    setField(dialog, "respuesta", labels.respuesta[data.get("respuesta")] ?? "correo");
    setField(dialog, "motivo", labels.motivo[data.get("motivo")] ?? "sin motivo");

    dialog.showModal(); // modal: bloquea el fondo, atrapa el foco y se cierra con Esc
  });

  // Al cerrar el modal (botón, Esc o clic afuera), limpiamos el formulario
  dialog.addEventListener("close", () => {
    form.reset();
    form.querySelector("input, select, textarea")?.focus();
  });

  // Clic en el fondo (backdrop) cierra el modal
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close("backdrop");
  });
});

/**
 * Escribe un valor en el elemento [data-field="<name>"] dentro de un contenedor.
 */
function setField(container, name, value) {
  const el = container.querySelector(`[data-field="${name}"]`);
  if (el) el.textContent = value;
}
