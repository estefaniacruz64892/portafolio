/**
 * <project-card> — Web Component reutilizable (Módulo 16: Template, slot, and shadow)
 *
 * Uso:
 *   <project-card href="https://..." status="En producción">
 *     <span slot="title">Nombre</span>
 *     <span slot="description">Descripción</span>
 *     <span slot="tags">Tecnologías</span>
 *   </project-card>
 *
 * Atributos:
 *   href   → destino del enlace "Ver más" (si falta, el enlace se oculta)
 *   status → etiqueta de estado (si falta, se oculta)
 */
class ProjectCard extends HTMLElement {
  // Atributos que, si cambian, vuelven a pintar la tarjeta
  static get observedAttributes() {
    return ["href", "status"];
  }

  constructor() {
    super();

    const template = document.getElementById("project-card-template");
    if (!template) {
      // Falla visible y explícita en vez de un componente vacío sin explicación
      console.error("[project-card] No se encontró <template id=\"project-card-template\">.");
      return;
    }

    // mode "open": permite inspeccionar el shadow root desde DevTools (element.shadowRoot)
    const shadow = this.attachShadow({ mode: "open" });

    // cloneNode(true): copia profunda. Cada tarjeta tiene su propia instancia,
    // la plantilla original queda intacta para reutilizarla.
    shadow.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    const link = this.shadowRoot.querySelector(".link");
    const status = this.shadowRoot.querySelector(".status");

    // Enlace
    const href = this.getAttribute("href");
    if (href) {
      link.href = href;
      link.hidden = false;

      // Enlaces externos: pestaña nueva + noopener (evita que la página destino controle esta)
      const isExternal = /^https?:\/\//i.test(href);
      if (isExternal) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      } else {
        link.removeAttribute("target");
        link.removeAttribute("rel");
      }

      // Nombre accesible descriptivo: "Ver más sobre <título>" en vez de solo "Ver más"
      const title = this.querySelector('[slot="title"]')?.textContent.trim();
      if (title) link.setAttribute("aria-label", `Ver más sobre ${title}`);
    } else {
      link.hidden = true;
    }

    // Estado
    const statusText = this.getAttribute("status");
    status.textContent = statusText ?? "";
    status.hidden = !statusText;
  }
}

// Registro del elemento. El nombre debe llevar guion (regla de los custom elements).
if (!customElements.get("project-card")) {
  customElements.define("project-card", ProjectCard);
}
